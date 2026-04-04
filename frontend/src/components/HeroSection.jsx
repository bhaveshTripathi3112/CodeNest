import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function HeroSection() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleStartSolving = () => {
    if (user) {
      navigate("/problems");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[80vh] px-6 bg-gray-100">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Welcome to <span className="text-blue-600">CodeHub</span>
      </h1>

      <p className="max-w-2xl text-gray-600 text-lg mb-8">
        Sharpen your coding skills, solve challenges, and compete with developers worldwide.
      </p>

      <button
        onClick={handleStartSolving}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Start Solving
      </button>
    </section>
  );
}

export default HeroSection;