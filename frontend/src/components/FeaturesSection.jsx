import React from "react";
import { Code, BarChart, Award, Shield } from "lucide-react";

const features = [
  {
    icon: <Code size={28} />,
    title: "Interactive Code Editor",
    desc: "Write and run code in real time directly in your browser.",
  },
  {
    icon: <Award size={28} />,
    title: "Gamified Learning",
    desc: "Earn points, badges, and climb the global leaderboard.",
  },
  {
    icon: <BarChart size={28} />,
    title: "Detailed Insights",
    desc: "Track your performance, accuracy, and coding streaks.",
  },
  {
    icon: <Shield size={28} />,
    title: "Secure Environment",
    desc: "Run your code safely in isolated sandboxes.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-16 px-6 bg-white border-t">
      <h2 className="text-3xl font-bold text-center text-black mb-10">
        Why Choose <span className="text-blue-600">CodeHub</span>?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-5 border rounded bg-gray-50"
          >
            <div className="text-blue-600 mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold text-black mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;