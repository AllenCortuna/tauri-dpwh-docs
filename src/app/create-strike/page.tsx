"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { errorToast } from "../../../config/toast";
import Database from "@tauri-apps/plugin-sql";
import Link from "next/link";

interface FormData {
  contractID: string;
  contractName: string;
  budget: string;
  date: string;
  category: string;
}

interface Option {
  value: string;
  label: string;
}

const Create3Strike: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<FormData>({
    contractID: "",
    contractName: "",
    budget: "",
    date: "",
    category: "",
  });

  const options: Option[] = [
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Goods and Services", label: "Goods and Services" },
    { value: "Consultancy", label: "Consultancy" },
  ];

  // Initialize the database and create the table if it doesn't exist
  const initializeDatabase = async () => {
    try {
      const db = await Database.load("sqlite:tauri.db");

      // Create the contracts table if it doesn't exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS contracts (
          contractID TEXT PRIMARY KEY,
          contractName TEXT,
          budget TEXT,
          date TEXT,
          category TEXT
        );
      `);

      console.log("Database initialized and table created (if it didn't exist).");
    } catch (error) {
      console.error("Error initializing database:", error);
      errorToast(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Call initializeDatabase when the component mounts
  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = (selectedOption: Option | null): void => {
    setData((prevData) => ({
      ...prevData,
      category: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize database connection
      const db = await Database.load("sqlite:tauri.db");

      // Start a transaction
      await db.execute("BEGIN");

      try {
        // Insert contract data
        await db.execute(
          `INSERT INTO contracts (contractID, contractName, budget, date, category)
           VALUES (?, ?, ?, ?, ?)`,
          [
            data.contractID,
            data.contractName,
            data.budget,
            data.date,
            data.category,
          ]
        );

        // Commit the transaction
        await db.execute("COMMIT");
        alert("Data saved successfully!");
        console.log("Data saved successfully!");

      } catch (error) {
        // Rollback on error
        await db.execute("ROLLBACK");
        console.error("Error saving data:", error);
        errorToast(`Failed to save data to database: ${error instanceof Error ? error.message : String(error)}`);
      }

    } catch (error) {
      console.error("Database error:", error);
      errorToast(`Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center pb-20">
      <ToastContainer />
      <form className="flex flex-col gap-8 min-w-[60rem] mx-auto">
        <div className="flex gap-10">
          <input
            name="contractID"
            value={data.contractID}
            onChange={handleChange}
            placeholder="Contract ID"
            className="custom-input w-48"
            type="text"
          />
          <input
            name="contractName"
            value={data.contractName}
            onChange={handleChange}
            placeholder="Contract Name"
            className="custom-input w-full"
            type="text"
          />
        </div>
        <div className="flex gap-10">
          <CreatableSelect<Option>
            value={options.find((option) => option.value === data.category)}
            onChange={handleSelect}
            options={options}
            isClearable
            className="text-xs bg-zinc-200 w-80"
            placeholder="Procurement Category"
          />
          <input
            name="budget"
            value={data.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="custom-input w-48"
            type="number"
          />
          <span className="tooltip" data-tip="Date of Report">
            <input
              name="date"
              value={data.date}
              onChange={handleChange}
              className="custom-input w-40"
              type="date"
            />
          </span>
        </div>
      </form>
      <button
        type="submit"
        className={`btn fixed bottom-10 left-1/2 transform -translate-x-1/2 ${
          isLoading ? "btn-disable" : "btn-neutral"
        } text-xs w-80`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Download Documents"}
      </button>
      <Link
        href={"/create-strike/search"}
        className="btn btn-neutral text-xs w-80"
      >
        Search Contract
      </Link>
    </div>
  );
};

export default Create3Strike;