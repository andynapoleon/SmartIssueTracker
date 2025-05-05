import React from "react";
import { useParams, Link } from "react-router-dom";

interface IssueDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  team: string;
  createdAt: string;
}

const IssuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // This would be replaced with an actual GraphQL query
  const mockIssue: IssueDetails = {
    id: id || "1",
    title: "Payment processing fails intermittently",
    description:
      "Users report that sometimes when they try to pay for their subscription, the payment appears to go through but they get an error message.",
    status: "TRIAGED",
    category: "Bug",
    priority: "High",
    team: "Payments Team",
    createdAt: "2023-05-10T10:30:00Z",
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Issues
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">{mockIssue.title}</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            {mockIssue.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm text-gray-500 font-medium mb-2">Category</h3>
            <p className="text-gray-900">{mockIssue.category}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm text-gray-500 font-medium mb-2">Priority</h3>
            <p className="text-gray-900">{mockIssue.priority}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm text-gray-500 font-medium mb-2">
              Assigned Team
            </h3>
            <p className="text-gray-900">{mockIssue.team}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {mockIssue.description}
          </p>
        </div>

        <div className="border-t pt-4 text-gray-500 text-sm">
          Created on {new Date(mockIssue.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
