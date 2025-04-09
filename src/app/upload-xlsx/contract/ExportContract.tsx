"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import * as XLSX from "xlsx";
import { errorToast } from "../../../../config/toast";
import { FiDownload } from "react-icons/fi";
import { Contract } from "../../../../config/interface";

interface ExcelRow {
  "Batch No.": string;
  "Year": string;
  "Posting Date": string;
  "Pre-Bid Date": string;
  "Bidding Date": string;
  "Contract ID": string;
  "Project Name": string;
  "Contract Amount"?: string;
  "Contractor"?: string;
  "Bid Evaluation Start"?: string;
  "Bid Evaluation End"?: string;
  "Post-Qualification Start"?: string;
  "Post-Qualification End"?: string;
  "Resolution"?: string;
  "NOA"?: string;
  "NTP"?: string;
  "NTP Received"?: string;
  "Contract Signed"?: string;
}

const ExportContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch contracts from the database
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        const result = await db.select<Contract[]>("SELECT * FROM contracts");
        setContracts(result);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        errorToast("Failed to fetch contracts.");
      }
    };

    fetchContracts();
  }, []);

  const handleExport = () => {
    setIsLoading(true);

    try {
      // Map the contracts data to the desired Excel row format
      const excelData: ExcelRow[] = contracts.map((contract) => ({
        "Batch No.": contract.batch,
        "Year": contract.year, // Added year field
        "Posting Date": contract.posting,
        "Pre-Bid Date": contract.preBid,
        "Bidding Date": contract.bidding,
        "Contract ID": contract.contractID,
        "Project Name": contract.projectName,
        "Contract Amount": contract.contractAmount,
        "Contractor": contract.contractor,
        "Bid Evaluation Start": contract.bidEvalStart,
        "Bid Evaluation End": contract.bidEvalEnd,
        "Post-Qualification Start": contract.postQualStart,
        "Post-Qualification End": contract.postQualEnd,
        "Resolution": contract.reso,
        "NOA": contract.noa,
        "NTP": contract.ntp,
        "NTP Received": contract.ntpRecieve,
        "Contract Signed": contract.contractDate,
      }));

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

      // Write the workbook to a file
      XLSX.writeFile(workbook, "contracts.xlsx");

      alert("Contracts exported successfully!");
    } catch (error) {
      console.error("Failed to export contracts:", error);
      errorToast("Failed to export contracts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <button
        className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 transform hover:scale-105 my-auto"
        disabled={isLoading}
        onClick={handleExport}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <FiDownload className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Export Contracts</h2>
          <p className="text-gray-600 text-sm mb-4">
            Download contracts data as Excel file
          </p>
          {isLoading && <span className="text-gray-500">Exporting...</span>}
        </div>
      </button>
  );
};

export default ExportContracts;