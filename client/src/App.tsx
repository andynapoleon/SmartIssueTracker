import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IssuePage from "./pages/IssuePage";
import CreateIssuePage from "./pages/CreateIssuePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Smart Issue Tracker
        </h1>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/issues/:id" element={<IssuePage />} />
          <Route path="/create" element={<CreateIssuePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
