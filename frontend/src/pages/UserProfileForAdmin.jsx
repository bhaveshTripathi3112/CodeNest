import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { useParams } from "react-router";

const difficultyColor = {
  easy: "text-green-600 bg-green-100",
  medium: "text-yellow-600 bg-yellow-100",
  hard: "text-red-600 bg-red-100",
};

export default function UserProfileForAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get(`/user/getProfile/${id}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white border rounded p-8">

        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-800 text-3xl font-bold text-white">
            {profile.firstName[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-black">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600">{profile.emailId}</p>
            <p className="text-sm mt-1 px-2 py-1 bg-gray-200 inline-block rounded">
              Role: {profile.role}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="bg-gray-50 border rounded p-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-600">
                Total Problems Solved
              </h2>
              <p className="text-2xl font-bold text-blue-600">
                {profile.totalSolved}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Last Updated: {new Date(profile.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Solved Problems */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
            Solved Problems
          </h2>

          {profile.problemsSolved.length === 0 ? (
            <p className="text-gray-500">
              No problems solved yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="bg-gray-100 border-b">
                  <tr className="text-gray-700">
                    <th className="py-3 px-2">Title</th>
                    <th className="py-3 px-2">Difficulty</th>
                    <th className="py-3 px-2">Tag</th>
                  </tr>
                </thead>

                <tbody>
                  {profile.problemsSolved.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 font-medium text-blue-600">
                        {p.title}
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColor[p.difficulty]}`}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-gray-600">
                        {p.tags}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}