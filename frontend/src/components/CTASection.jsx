import React from "react";
import { useNavigate } from "react-router";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 bg-gray-100 text-center border-t">
      <h2 className="text-3xl font-bold text-black mb-4">
        Ready to test your skills?
      </h2>

      <p className="text-gray-600 mb-8 max-w-xl mx-auto">
        Start solving problems, improve your coding logic, and become a better developer with CodeHub.
      </p>

      <button
        onClick={() => navigate("/problems")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Explore Problems
      </button>
    </section>
  );
}

export default CTASection;