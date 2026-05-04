import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { axiosClient } from "../utils/axiosClient";
import Toast from "../components/Toaster";

const languageOptions = ["c++", "java", "javascript"];

export default function SolveProblemPage() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("c++");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("description"); // description | submissions | solution
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null); // result of last SUBMIT
  const [testCaseResults, setTestCaseResults] = useState([]); // array of booleans: true = passed
  const [hasAccepted, setHasAccepted] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [toast, setToast] = useState(null);
  const [hintError, setHintError] = useState("");

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const editorRef = useRef(null);

  // fetch problem once
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/ProblemById/${id}`);
        const prob = res.data;
        setProblem(prob);

        // load starter code for default language (c++)
        const start = prob.startCode?.find(
          (s) => s.language.toLowerCase() === "c++"
        );
        if (start) setCode(start.initialCode);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  // fetch submissions (when user opens the tab or after submit)
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axiosClient.get(`/problem/submittedProblem/${id}`);
      const subs = Array.isArray(res.data)
        ? res.data
        : res.data.submissions || [];
      setSubmissions(subs);

      // if any accepted previously, allow solution tab
      if (subs.some((s) => s.status === "accepted")) {
        setHasAccepted(true);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const start = problem.startCode?.find(
      (s) => s.language.toLowerCase() === lang.toLowerCase()
    );
    if (start) setCode(start.initialCode);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const res = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language,
      });

      const data = res.data;

      if (data.errorMessage) {
        setOutput(`Error: ${data.errorMessage}`);
        setTestCaseResults([]);
        return;
      }

      // USE ONLY VISIBLE TEST CASES FOR RUN
      const totalVisible = problem.visibleTestCases.length;

      const passed = data.testCasesPassed ?? 0;

      setOutput(
        `Status: ${data.status}\n` +
          `Test Cases Passed: ${passed}/${totalVisible}\n` +
          `Runtime: ${data.runtime} sec\n` +
          `Memory: ${data.memory} KB`
      );

      // Create UI results only for visible tests
      const resultsArray = Array.from({ length: totalVisible }, (_, i) => i < passed);

      setTestCaseResults(resultsArray);
    } catch (err) {
      console.error(err);
      setOutput("Error executing code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      const res = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language,
      });
      const data = res.data;
      setSubmissionResult(data);

      const total = data.testCasesTotal ?? problem.visibleTestCases.length;
      const passed = data.testCasesPassed ?? 0;
      const resultsArray = Array.from({ length: total }, (_, i) => i < passed);
      setTestCaseResults(resultsArray);

      if (data.status === "accepted") {
        setHasAccepted(true);
      }

      setSubmissions((prev) => (data ? [data, ...prev] : prev));
    } catch (err) {
      console.error("Submit error:", err);
      setSubmissionResult({
        status: "error",
        errorMessage: "Submission failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSubmission = (submission) => {
    if (!submission) return;
    setCode(submission.code);
    setSelectedSubmission(submission);
    setSubmissionResult(submission);

    const total = submission.testCasesTotal ?? problem.visibleTestCases.length;
    const passed = submission.testCasesPassed ?? 0;
    const resultsArray = Array.from({ length: total }, (_, i) => i < passed);
    setTestCaseResults(resultsArray);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Disable right-click context menu
    editor.updateOptions({ contextmenu: false });

    // Disable Ctrl+C / Ctrl+V / Ctrl+X shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {});
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {});
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {});

    // Disable clipboard events
    const domNode = editor.getDomNode();
    if (domNode) {
      ["copy", "paste", "cut", "contextmenu"].forEach((evt) => {
        domNode.addEventListener(evt, (e) => e.preventDefault());
      });
    }
  };


  if (!problem) return <p className="p-6 text-gray-600">Loading problem...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="md:w-1/2 border-r border-gray-300 p-6 overflow-y-auto bg-white">
        <div className="flex gap-3 mb-4 flex-wrap">
          {["description", "submissions","solution"].map((tab) => (
            <button
              key={tab}
              disabled={
                (tab === "solution" && !hasAccepted) 
                
              }
              onClick={() => {
                setActiveTab(tab);
                if (tab === "submissions") fetchSubmissions();
               
              }}
              className={`px-3 py-1 rounded text-sm border ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : tab === "solution" && !hasAccepted
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Description */}
        {activeTab === "description" && (
          <div>
            <h1 className="text-2xl font-bold text-black mb-3">{problem.title}</h1>

            <p className="text-gray-700 whitespace-pre-line">
              {problem.description}
            </p>

            <p className="text-sm text-gray-600 mt-4">
              Difficulty:{" "}
              <span
                className={
                  problem.difficultyLevel === "easy"
                    ? "text-green-600"
                    : problem.difficultyLevel === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {problem.difficultyLevel}
              </span>
            </p>

            <h3 className="text-lg font-semibold text-black mt-6 mb-3">
              Example Test Cases
            </h3>

            <div className="space-y-4">
              {problem.visibleTestCases?.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-300 p-3 rounded"
                >
                  <p className="text-sm mb-2">
                    <strong>Input:</strong>
                    <div className="whitespace-pre-wrap text-gray-800 bg-white border rounded p-2 mt-1">
                      {String(t.input)}
                    </div>
                  </p>

                  <p className="text-sm mb-2">
                    <strong>Expected Output:</strong>
                    <p className="whitespace-pre-wrap text-gray-800 bg-white border rounded p-2 mt-1">
                      {String(t.output)}
                    </p>
                  </p>

                  {t.explanation && (
                    <p className="text-xs text-gray-500 mt-1">{t.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submissions */}
        {activeTab === "submissions" && (
          <div className="bg-white border rounded p-5">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Your Submissions
            </h2>

            {loadingSubmissions ? (
              <p className="text-gray-500">Loading submissions...</p>
            ) : submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission._id}
                    onClick={() => handleViewSubmission(submission)}
                    className={`p-4 rounded border cursor-pointer ${
                      selectedSubmission?._id === submission._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          submission.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : submission.status === "runtime error"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {submission.status.toUpperCase()}
                      </span>

                      <p className="text-xs text-gray-500">
                        {new Date(submission.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div>
                        <p>
                          <span className="text-gray-500">Runtime:</span>{" "}
                          {submission.runtime}s
                        </p>
                        <p>
                          <span className="text-gray-500">Memory:</span>{" "}
                          {submission.memory}KB
                        </p>
                      </div>

                      <div className="text-gray-500 text-xs">
                        Language: {submission.language || "C++"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  You haven’t submitted any solutions yet.
                </p>
                <p className="text-gray-400 text-xs">
                  Solve the problem and view your submissions here!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Solution */}
        {activeTab === "solution" && hasAccepted && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-3">
              Solution
            </h2>
            <pre className="bg-gray-50 border border-gray-300 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
              {(() => {
                if (!problem.referenceSolution)
                  return "No solution available.";
                const sol = problem.referenceSolution.find(
                  (r) =>
                    r.language?.toLowerCase() === language.toLowerCase() ||
                    (r.language === "c++" && language === "c++")
                );
                return sol
                  ? sol.completeCode
                  : JSON.stringify(problem.referenceSolution, null, 2);
              })()}
            </pre>
          </div>
        )}

      </div>

      {/* RIGHT PANEL */}
      <div className="md:w-1/2 flex flex-col p-6 overflow-y-auto">
        {/* Language + buttons */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex gap-3">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded text-sm border ${
                  language === lang
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`px-4 py-2 rounded text-white ${
                isRunning ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="rounded overflow-hidden border border-gray-300">
          <Editor
            height="50vh"
            theme="vs-dark"
            language={
              language === "c++"
                ? "cpp"
                : language === "javascript"
                ? "javascript"
                : "java"
            }
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
            }}
            // onMount={handleEditorDidMount}
          />
        </div>

        {/* Sample test cases */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-black mb-3">
            Sample Test Cases
          </h3>

          {problem.visibleTestCases?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {problem.visibleTestCases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestCase(i)}
                  className={`px-3 py-1 rounded text-sm border ${
                    activeTestCase === i
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Test Case {i + 1}
                </button>
              ))}
            </div>
          )}

          {problem.visibleTestCases?.[activeTestCase] && (() => {
            const t = problem.visibleTestCases[activeTestCase];
            const passed =
              testCaseResults.length > 0 && testCaseResults[activeTestCase] === true;
            const failed =
              testCaseResults.length > 0 && testCaseResults[activeTestCase] === false;

            return (
              <div
                className={`border rounded p-3 mb-3 ${
                  passed
                    ? "bg-green-50 border-green-400"
                    : failed
                    ? "bg-red-50 border-red-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm mb-2">
                      <strong>Input:</strong>
                      <div className="whitespace-pre-wrap text-gray-800 bg-gray-100 rounded p-2 mt-1">
                        {String(t.input)}
                      </div>
                    </p>

                    <p className="text-sm mb-2">
                      <strong>Expected Output:</strong>
                      <pre className="whitespace-pre-wrap text-gray-800 bg-gray-100 rounded p-2 mt-1">
                        {String(t.output)}
                      </pre>
                    </p>

                    {t.explanation && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t.explanation}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        passed
                          ? "text-green-600"
                          : failed
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {testCaseResults.length === 0
                        ? "Not run"
                        : passed
                        ? "Passed"
                        : "Failed"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Output */}
        {output && (
          <div className="mt-4 bg-white border border-gray-300 p-3 rounded">
            <h4 className="text-md font-semibold text-black mb-2">
              Output
            </h4>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}

        {/* Submission result */}
        {submissionResult && (
          <div className="mt-4 bg-white border border-gray-300 p-4 rounded">
            <h4 className="text-md font-semibold text-black mb-2">
              Submission Result
            </h4>

            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={
                  submissionResult.status === "accepted"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {submissionResult.status}
              </span>
            </p>

            {submissionResult.errorMessage && (
              <p className="text-sm text-red-600 mt-1">
                {submissionResult.errorMessage}
              </p>
            )}

            <div className="mt-2 text-sm text-gray-700">
              <p>
                <strong>Runtime:</strong> {submissionResult.runtime ?? "-"} sec
              </p>
              <p>
                <strong>Memory:</strong> {submissionResult.memory ?? "-"} KB
              </p>
              <p>
                <strong>Test Cases Passed:</strong>{" "}
                {submissionResult.testCasesPassed ?? 0}/
                {submissionResult.testCasesTotal ??
                  problem.visibleTestCases.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}