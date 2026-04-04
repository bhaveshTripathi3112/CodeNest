import React from "react";
import { NavLink } from "react-router";

function ProblemsTable({ filteredProblems, solvedProblems }) {
  const getDifficultyColor = (difficultyLevel) => {
    switch (difficultyLevel?.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white border rounded overflow-hidden">
      {filteredProblems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No problems found with current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 w-12">Status</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 w-32">Difficulty</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>

            <tbody>
              {filteredProblems.map((problem, index) => {
                const isSolved = solvedProblems.some(
                  (sp) => sp._id === problem._id
                );
                const difficultyColor = getDifficultyColor(
                  problem.difficultyLevel
                );

                return (
                  <tr
                    key={problem._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {isSolved ? (
                        <span className="text-green-600 text-lg">●</span>
                      ) : (
                        <span className="text-gray-400 text-lg">○</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {index + 1}. {problem.title}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-medium ${difficultyColor}`}>
                        {problem.difficultyLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {(Array.isArray(problem.tags)
                          ? problem.tags
                          : typeof problem.tags === "string"
                          ? problem.tags.split(",").map((tag) => tag.trim())
                          : []
                        ).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 border rounded text-xs text-gray-600 bg-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProblemsTable;