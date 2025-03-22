"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import * as XLSX from "xlsx";

interface Contractor {
  contractorName: string;
  address: string;
  email: string;
  amo: string;
  designation: string;
  tin: string;
}

const ExportContractors: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch contractors from the database
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        const result = await db.select<Contractor[]>(
          "SELECT * FROM contractors"
        );
        setContractors(result);
      } catch (error) {
        console.error("Failed to fetch contractors:", error);
        alert("Failed to fetch contractors.");
      }
    };

    fetchContractors();
  }, []);

  const handleExport = () => {
    setIsLoading(true);

    try {
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(contractors);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contractors");

      // Write the workbook to a file
      XLSX.writeFile(workbook, "contractors.xlsx");

      alert("Contractors exported successfully!");
    } catch (error) {
      console.error("Failed to export contractors:", error);
      alert("Failed to export contractors.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="bg-white rounded-lg my-auto p-6 shadow-md transition-all duration-300 transform hover:scale-105"
      disabled={isLoading}
      onClick={handleExport}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Export Contractors</h2>
        <p className="text-gray-600 text-sm mb-4">
          Download contractors data as Excel file
        </p>
      </div>
    </button>
  );
};

export default ExportContractors;
