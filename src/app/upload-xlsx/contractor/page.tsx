"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../../config/toast";
import Database from "@tauri-apps/plugin-sql";
import * as XLSX from "xlsx";

interface Contractor {
  email: string;
  address: string;
  amo: string;
  lastUpdated: string;
  tin: string;
  contractorName: string;
}

interface ExcelRow {
  "email": string;
  "address": string;
  "amo": string;
  "tin": string;
  "contractorName": string;
}

const UploadContractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");

        await db.execute(`
          CREATE TABLE IF NOT EXISTS contractors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL,
            amo TEXT,
            tin TEXT,
            contractorName TEXT NOT NULL,
            lastUpdated TEXT NOT NULL
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
          const parsedContractors = json.map((row) => ({
            email: row["email"],
            address: row["address"],
            amo: row["amo"],
            tin: row["tin"],
            contractorName: row["contractorName"],
            lastUpdated: new Date().toISOString(),
          }));
          setContractors(parsedContractors);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contractors.length === 0) {
      errorToast("Please upload a file with contractors.");
      return;
    }

    setIsLoading(true);
    try {
      const db = await Database.load("sqlite:tauri.db");

      for (const contractor of contractors) {
        // Check if contractor exists
        const existingContractor = await db.select(
          "SELECT * FROM contractors WHERE email = ?",
          [contractor.email]
        );

        if ((existingContractor as Contractor[]).length > 0) {
          // Update existing contractor
          await db.execute(
            `UPDATE contractors SET 
              address = ?, 
              amo = ?, 
              tin = ?, 
              contractorName = ?, 
              lastUpdated = ?
            WHERE email = ?`,
            [
              contractor.address,
              contractor.amo || null,
              contractor.tin || null,
              contractor.contractorName,
              contractor.lastUpdated,
              contractor.email,
            ]
          );
        } else {
          // Insert new contractor
          await db.execute(
            `INSERT INTO contractors (
              email, address, amo, tin, contractorName, lastUpdated
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              contractor.email,
              contractor.address,
              contractor.amo || null,
              contractor.tin || null,
              contractor.contractorName,
              contractor.lastUpdated,
            ]
          );
        }
      }

      setContractors([]);
      successToast("Contractors submitted successfully!");
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
        className="w-full max-w-4xl bg-white border border-dashed border-zinc-400 bg-opacity-20 rounded-lg shadow-md p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Upload Contractors
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
          {isLoading ? "Loading..." : "Submit Contractors"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UploadContractor;