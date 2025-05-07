"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { errorToast } from "../../../../config/toast";
import { FiDownload } from "react-icons/fi";
import { Contract } from "../../../../config/interface";
import { invoke } from "@tauri-apps/api/core";

interface ExcelRow {
  "Batch No.": string;
  Year: string;
  "Posting Date": string;
  "Pre-Bid Date": string;
  "Bidding Date": string;
  "Contract ID": string;
  "Project Name": string;
  "Contract Amount"?: string;
  Contractor?: string;
  "Bid Evaluation Start"?: string;
  "Bid Evaluation End"?: string;
  "Post-Qualification Start"?: string;
  "Post-Qualification End"?: string;
  Resolution?: string;
  NOA?: string;
  NTP?: string;
  "NTP Received"?: string;
  "Contract Signed"?: string;
}

const ExportContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Generate years for the dropdown (past 10 years)
  const currentYear = new Date().getFullYear();
  const years = [
    "All",
    ...Array.from({ length: 10 }, (_, i) => (currentYear - i).toString()),
  ];

  // Status options
  const statusOptions = ["All", "posted", "awarded", "proceed"];

  // Fetch contracts from the database
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const result = await invoke("execute_mssql_query", {
          queryRequest: {
            query: "SELECT * FROM contracts",
            params: [],
          },
        });
        setContracts((result as { rows: Contract[] }).rows);
        setFilteredContracts((result as { rows: Contract[] }).rows);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        errorToast("Failed to fetch contracts.");
      }
    };

    fetchContracts();
  }, []);

  // Filter contracts when year or status changes
  useEffect(() => {
    let filtered = [...contracts];

    // Filter by year
    if (selectedYear !== "All") {
      filtered = filtered.filter((contract) => contract.year === selectedYear);
    }

    // Filter by status
    if (selectedStatus !== "All") {
      switch (selectedStatus) {
        case "posted":
          filtered = filtered.filter(
            (contract) => contract.posting && !contract.noa && !contract.ntp
          );
          break;
        case "awarded":
          filtered = filtered.filter(
            (contract) => contract.noa && !contract.ntp
          );
          break;
        case "proceed":
          filtered = filtered.filter((contract) => contract.ntp);
          break;
      }
    }

    setFilteredContracts(filtered);
  }, [selectedYear, selectedStatus, contracts]);

  const handleExport = () => {
    setIsLoading(true);

    try {
      // Map the filtered contracts data to the desired Excel row format
      const excelData: ExcelRow[] = filteredContracts.map((contract) => ({
        "Batch No.": contract.batch,
        Year: contract.year,
        "Posting Date": contract.posting,
        "Pre-Bid Date": contract.preBid,
        "Bidding Date": contract.bidding,
        "Contract ID": contract.contractID,
        "Project Name": contract.projectName,
        "Contract Amount": contract.contractAmount,
        Contractor: contract.contractor,
        "Bid Evaluation Start": contract.bidEvalStart,
        "Bid Evaluation End": contract.bidEvalEnd,
        "Post-Qualification Start": contract.postQualStart,
        "Post-Qualification End": contract.postQualEnd,
        Resolution: contract.reso,
        NOA: contract.noa,
        NTP: contract.ntp,
        "NTP Received": contract.ntpRecieve,
        "Contract Signed": contract.contractDate,
      }));

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

      // Generate filename with filters
      const yearPart = selectedYear !== "All" ? `_${selectedYear}` : "";
      const statusPart = selectedStatus !== "All" ? `_${selectedStatus}` : "";
      const filename = `contracts${yearPart}${statusPart}.xlsx`;

      // Write the workbook to a file
      XLSX.writeFile(workbook, filename);

      alert("Contracts exported successfully!");
    } catch (error) {
      console.error("Failed to export contracts:", error);
      errorToast("Failed to export contracts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 transform hover:scale-105 my-auto"
        disabled={isLoading || filteredContracts.length === 0}
        onClick={handleExport}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <FiDownload className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-lime-700 mb-4">
            Export Contracts
          </h2>
          <p className="text-gray-600 text-xs mb-4">
            Download contracts data as Excel file
          </p>
          {isLoading && <span className="text-gray-500">Exporting...</span>}
        </div>
      </button>

      <div className="w-full max-w-md mt-6 flex flex-col gap-4 text-xs">
        <div className="flex flex-col">
          <label
            htmlFor="yearFilter"
            className="font-medium text-gray-700 mb-1"
          >
            Filter by Year:
          </label>
          <select
            id="yearFilter"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="statusFilter"
            className="font-medium text-gray-700 mb-1"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="text-gray-600 p-">
          {filteredContracts.length} contracts selected for export
        </div>
      </div>
    </div>
  );
};

export default ExportContracts;
