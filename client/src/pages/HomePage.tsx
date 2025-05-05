import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Issues</h2>
        <Link
          to="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Issue
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center py-8">
          No issues found. Create your first issue to get started.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
