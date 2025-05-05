import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    // This would be replaced with an actual GraphQL mutation
    console.log("Creating issue with description:", description);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Issue</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Issue Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Describe your issue in plain language. Our AI will automatically categorize and prioritize it."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <p className="mt-2 text-sm text-gray-500">
            Simply describe the problem in your own words.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting || !description.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssuePage;
