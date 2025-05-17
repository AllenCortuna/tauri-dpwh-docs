"use client";
import React from "react";
import useSelectDatabase from "../../../config/useSelectDatabase";
import useShowFab from "../../../config/useShowFab";
import useShowDashboard from "../../../config/useShowDashboard"; // Import useShowDashboard
import { MdToggleOn, MdToggleOff } from "react-icons/md"; // Import icons

const Settings = () => {
  const { databaseType, handleToggle } = useSelectDatabase();
  const { showFab, handleToggle: toggleFab } = useShowFab();
  const { showDashboard, handleToggle: toggleDashboard } = useShowDashboard(); // Use the hook

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex flex-wrap justify-center items-start p-10 w-full gap-10">
        <div className="mb-6 p-6 rounded-lg bg-white bg-opacity-55 max-w-sm">
          <h2 className="text-md font-bold mb-3 text-neutral">Database Type</h2>
          <p className="text-xs text-gray-600 mb-4">
            Select which database type to use for the application.
          </p>

          <div className="flex items-center text-sm space-x-10 mt-8">
            <button
              onClick={() => handleToggle("contracts")}
              className={`px-4 py-2 rounded-md transition-colors ${
                databaseType === "contracts"
                  ? "bg-lime-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Infra
            </button>

            <button
              onClick={() => handleToggle("goods")}
              className={`px-4 py-2 rounded-md transition-colors ${
                databaseType === "goods"
                  ? "bg-lime-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Goods
            </button>
          </div>

          <p className="p-3 mt-8 text-xs text-gray-500">
            Current selection:{" "}
            <span className="font-medium">
              {databaseType === "goods" ? "Goods and Services" : "Civil Works"}
            </span>
          </p>
        </div>

        <div className="mb-6 p-6 rounded-lg bg-white bg-opacity-55 max-w-sm">
          <h2 className="text-lg font-semibold mb-3">Quick Actions Menu</h2>
          <p className="text-xs text-gray-600 mb-4">
            Toggle the visibility of floating action buttons.
          </p>

          <div className="flex items-center text-sm mt-8">
            <button
              onClick={toggleFab}
              className={`px-4 py-2 rounded-md transition-colors ${
                showFab
                  ? "bg-lime-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showFab ? "Hide Quick Actions" : "Show Quick Actions"}
            </button>
          </div>

          <p className="p-3 mt-8 text-xs text-gray-500">
            Current status:{" "}
            <span className="font-medium">
              {showFab ? "Visible" : "Hidden"}
            </span>
          </p>
        </div>

        {/* Added InfraDashboard Toggle Card */}
        <div className="mb-6 p-6 rounded-lg bg-white bg-opacity-55 max-w-sm">
          <h2 className="text-lg font-semibold mb-3">Infra Dashboard</h2>
          <p className="text-xs text-gray-600 mb-4">
            Toggle the Infrastructure Dashboard on the main page.
          </p>

          <div className="flex items-center text-sm mt-8">
            <button
              onClick={toggleDashboard}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${ // Added flex items-center gap-2
                showDashboard
                  ? "bg-lime-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showDashboard ? <MdToggleOn className="w-5 h-5" /> : <MdToggleOff className="w-5 h-5" />}
              {showDashboard ? "Hide Infra Dashboard" : "Show Infra Dashboard"}
            </button>
          </div>

          <p className="p-3 mt-8 text-xs text-gray-500">
            Current status:{" "}
            <span className="font-medium">
              {showDashboard ? "Visible" : "Hidden"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
