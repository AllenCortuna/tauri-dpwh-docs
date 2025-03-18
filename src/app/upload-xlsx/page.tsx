"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast } from "../../../config/toast";
import Database from "@tauri-apps/plugin-sql";
import * as XLSX from "xlsx";

interface Contract {
  batch: string;
  posting: string;
  preBid: string;
  bidding: string;
  contractID: string;
  projectName: string;
  contractAmount?: string;
  contractor?: string;
  bidEvalStart?: string;
  bidEvalEnd?: string;
  postQualStart?: string;
  postQualEnd?: string;
  reso?: string;
  noa?: string;
  ntp?: string;
  ntpRecieve?: string;
  contractDate?: string;
}

interface ExcelRow {
  "Batch No.": string;
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

const UploadExcel: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await Database.load(
          "mysql://admin:admin123@localhost:8889/tauri"
        );
        console.log("db", db);

        await db.execute(`
          CREATE TABLE IF NOT EXISTS contracts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            batch VARCHAR(255) NOT NULL,
            posting VARCHAR(255) NOT NULL,
            preBid VARCHAR(255) NOT NULL,
            bidding VARCHAR(255) NOT NULL,
            contractID VARCHAR(255) NOT NULL UNIQUE,
            projectName TEXT NOT NULL,
            status VARCHAR(255) NOT NULL,
            contractAmount VARCHAR(255),
            contractor VARCHAR(255),
            bidEvalStart VARCHAR(255),
            bidEvalEnd VARCHAR(255),
            postQualStart VARCHAR(255),
            postQualEnd VARCHAR(255),
            reso VARCHAR(255),
            noa VARCHAR(255),
            ntp VARCHAR(255),
            ntpRecieve VARCHAR(255),
            contractDate VARCHAR(255),
            lastUpdated VARCHAR(255) NOT NULL
          );
        `);

        console.log("Database and table initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize database:", error);
        errorToast("Failed to initialize database.");
      }
    };

    initializeDatabase();
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
          const parsedContracts = json.map((row) => ({
            batch: row["Batch No."],
            posting: row["Posting Date"],
            preBid: row["Pre-Bid Date"],
            bidding: row["Bidding Date"],
            contractID: row["Contract ID"],
            projectName: row["Project Name"],
            contractAmount: row["Contract Amount"],
            contractor: row["Contractor"],
            bidEvalStart: row["Bid Evaluation Start"],
            bidEvalEnd: row["Bid Evaluation End"],
            postQualStart: row["Post-Qualification Start"],
            postQualEnd: row["Post-Qualification End"],
            reso: row["Resolution"],
            noa: row["NOA"],
            ntp: row["NTP"],
            ntpRecieve: row["NTP Received"],
            contractDate: row["Contract Signed"],
          }));
          setContracts(parsedContracts);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contracts.length === 0) {
      alert("Please upload a file with contracts.");
      return;
    }

    setIsLoading(true);
    try {
      const db = await Database.load(
        "mysql://admin:admin123@localhost:8889/tauri"
      );

      for (const contract of contracts) {
        await db.execute(
          `INSERT INTO contracts (
            batch, posting, preBid, bidding, contractID, projectName, status,
            contractAmount, contractor, bidEvalStart, bidEvalEnd, postQualStart,
            postQualEnd, reso, noa, ntp, ntpRecieve, contractDate, lastUpdated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            contract.batch,
            contract.posting,
            contract.preBid,
            contract.bidding,
            contract.contractID,
            contract.projectName,
            "posted",
            contract.contractAmount || null,
            contract.contractor || null,
            contract.bidEvalStart || null,
            contract.bidEvalEnd || null,
            contract.postQualStart || null,
            contract.postQualEnd || null,
            contract.reso || null,
            contract.noa || null,
            contract.ntp || null,
            contract.ntpRecieve || null,
            contract.contractDate || null,
            new Date().toISOString(),
          ]
        );
      }

      setContracts([]);
      alert("Contracts submitted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorToast(error.message);
      } else {
        console.error(error);
        errorToast("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <form
        className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Upload Contracts
        </h1>

        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Upload Excel File:
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit Contracts"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UploadExcel;