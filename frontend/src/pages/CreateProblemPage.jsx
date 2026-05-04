// CreateProblemPage.jsx
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router";
import { axiosClient } from "../utils/axiosClient";
import Toast from "../components/Toaster";

import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/webpack";

const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
    "array","linkedList","graph","tree","stack","queue","dp","strings","search"
  ]),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().min(1),
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
    })
  ),
  startCode: z.array(
    z.object({
      language: z.enum(["c++","java","javascript"]),
      initialCode: z.string().min(1),
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.enum(["c++","java","javascript"]),
      completeCode: z.string().min(1),
    })
  ),
});

export default function CreateProblemPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [],
      startCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "c++", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "javascript", completeCode: "" },
      ],
    },
  });

  const { fields: visibleFields, append, remove } =
    useFieldArray({ control, name: "visibleTestCases" });

  const { fields: hiddenFields, replace } =
    useFieldArray({ control, name: "hiddenTestCases" });

  // Robust parser
  const extractHiddenTestcases = (text) => {
    const regex = /INPUT:\s*([\s\S]*?)\s*OUTPUT:\s*([\s\S]*?)(?=INPUT:|$)/gi;
    const arr = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      arr.push({
        input: match[1].trim(),
        output: match[2].trim(),
      });
    }

    if (!arr.length) {
      showToast("Invalid INPUT/OUTPUT format", "error");
      return;
    }

    replace(arr);
    showToast(`${arr.length} hidden testcases loaded`, "success");
  };

  const handleDocxUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    extractHiddenTestcases(result.value);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((x) => x.str).join(" ") + "\n";
    }

    extractHiddenTestcases(text);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosClient.post("/problem/create", data);
      showToast("Problem created", "success");
      setTimeout(() => navigate("/admin"), 1000);
    } catch {
      showToast("Error creating problem", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h1 className="text-2xl font-bold mb-6">Create Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* BASIC */}
        <div className="bg-white p-6 border rounded space-y-3">
          <input {...register("title")} placeholder="Title" className="border p-2 w-full" />
          <textarea {...register("description")} placeholder="Description" rows={5} className="border p-2 w-full" />

          <select {...register("difficultyLevel")} className="border p-2">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select {...register("tags")} className="border p-2">
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="tree">Tree</option>
            <option value="stack">Stack</option>
            <option value="queue">Queue</option>
            <option value="dp">DP</option>
            <option value="strings">Strings</option>
            <option value="search">Search</option>
          </select>
        </div>

        {/* VISIBLE TESTCASES */}
        <div className="bg-white p-6 border rounded space-y-3">
          <h2 className="font-semibold">Visible Testcases</h2>

          {visibleFields.map((f, i) => (
            <div key={f.id} className="border p-3">
              <textarea {...register(`visibleTestCases.${i}.input`)} placeholder="Input" />
              <textarea {...register(`visibleTestCases.${i}.output`)} placeholder="Output" />
              <textarea {...register(`visibleTestCases.${i}.explanation`)} placeholder="Explanation" />
              <button type="button" onClick={() => remove(i)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={() => append({ input:"",output:"",explanation:"" })}>
            Add Testcase
          </button>
        </div>

        {/* HIDDEN TESTCASES */}
        <div className="bg-white p-6 border rounded space-y-3">
          <h2 className="font-semibold">Hidden Testcases</h2>

          <input
            type="file"
            accept=".docx,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              if (file.name.endsWith(".docx")) handleDocxUpload(e);
              else if (file.name.endsWith(".pdf")) handlePdfUpload(e);
              else showToast("Invalid file", "error");
            }}
          />

          {hiddenFields.map((hf, i) => (
            <div key={hf.id} className="border p-3 text-sm">
              <p><b>Testcase {i + 1}</b></p>
              <pre className="bg-gray-100 p-2">{hf.input}</pre>
              <pre className="bg-gray-100 p-2">{hf.output}</pre>
            </div>
          ))}
        </div>

        {/* STARTER CODE */}
        <div className="bg-white p-6 border rounded">
          <h2 className="font-semibold">Starter Code</h2>
          {["c++","java","javascript"].map((lang,i)=>(
            <textarea key={i} {...register(`startCode.${i}.initialCode`)} placeholder={lang} className="border p-2 w-full mb-2"/>
          ))}
        </div>

        {/* SOLUTION */}
        <div className="bg-white p-6 border rounded">
          <h2 className="font-semibold">Reference Solution</h2>
          {["c++","java","javascript"].map((lang,i)=>(
            <textarea key={i} {...register(`referenceSolution.${i}.completeCode`)} placeholder={lang} className="border p-2 w-full mb-2"/>
          ))}
        </div>

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          {isSubmitting ? "Creating..." : "Create Problem"}
        </button>

      </form>
    </div>
  );
}