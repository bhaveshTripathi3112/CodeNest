import React from "react";

function StatsSection() {
  const stats = [
    { label: "Active Users", value: "10" },
    { label: "Problems Solved", value: "25" },
    { label: "Coding Challenges", value: "10" },
    { label: "Global Reach", value: "0" },
  ];

  return (
    <section className="py-12 bg-white border-t">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 border rounded bg-gray-50">
            <h3 className="text-2xl font-bold text-blue-600">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;