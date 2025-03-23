"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import Link from "next/link";
import { FaUsers } from "react-icons/fa";
import { errorToast, successToast } from "../../../config/toast";

interface Contractor {
  contractorName: string;
  address: string;
  email: string;
  amo: string;
  designation: string;
  tin: string;
}

const CreateContractors: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [contractors, setContractors] = useState<Contractor[]>([
    {
      contractorName: "",
      address: "",
      email: "",
      amo: "",
      designation: "",
      tin: "",
    },
  ]);

  // Initialize the database and create the table if it doesn't exist
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");

        // Create the contractors table if it doesn't exist
        await db.execute(`
          CREATE TABLE IF NOT EXISTS contractors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contractorName TEXT NOT NULL,
            address TEXT NOT NULL,
            email TEXT,
            amo TEXT,
            designation TEXT,
            tin TEXT,
            lastUpdated TEXT NOT NULL
          );
        `);

        console.log("Database and contractors table initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize database:", error);
        errorToast("Failed to initialize database.");
      }
    };

    initializeDatabase();
  }, []);

  const handleContractorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedContractors = contractors.map((contractor, i) =>
      i === index ? { ...contractor, [name]: value } : contractor
    );
    setContractors(updatedContractors);
  };

  const addContractor = () => {
    setContractors([
      {
        contractorName: "",
        address: "",
        email: "",
        amo: "",
        designation: "",
        tin: "",
      },
      ...contractors,
    ]);
  };

  const removeContractor = (index: number) => {
    setContractors(contractors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const db = await Database.load("sqlite:tauri.db");

      for (const contractor of contractors) {
        await db.execute(
          `INSERT INTO contractors (
            contractorName, address, email, amo, designation, tin, lastUpdated
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            contractor.contractorName,
            contractor.address,
            contractor.email,
            contractor.amo,
            contractor.designation,
            contractor.tin,
            new Date().toISOString(),
          ]
        );
      }

      setContractors([
        {
          contractorName: "",
          address: "",
          email: "",
          amo: "",
          designation: "",
          tin: "",
        },
      ]);

      successToast("Contractors submitted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        successToast(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        successToast("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <form
        className="flex flex-col gap-8 min-w-[60rem] mx-auto mt-20"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4 mb-4">
          <Link
            type="button"
            className="fixed bottom-8 right-8 btn-neutral text-white btn text-xs hover:scale-125 transition-transform shadow-lg z-50"
            href="/contractors/search"
          >
            <FaUsers className="mr-2 text-2xl" /> Contractor List
          </Link>

          <button
            type="button"
            className="btn btn-outline text-neutral text-xs"
            onClick={addContractor}
          >
            Add Another Contractor
          </button>

          <button
            type="submit"
            className={`btn ${
              isLoading ? "btn-disable" : "btn-neutral"
            } text-xs`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Contractors"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...contractors].reverse().map((contractor, index) => {
            const originalIndex = contractors.length - 1 - index;
            return (
              <div
                key={originalIndex}
                className="flex flex-col gap-4 border p-4 rounded-none bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-neutral font-semibold">
                    Contractor {originalIndex + 1}
                  </h3>
                  {contractors.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-error btn-xs text-white"
                      onClick={() => removeContractor(originalIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  name="contractorName"
                  value={contractor.contractorName.toUpperCase()}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="text"
                  placeholder="Contractor Name"
                />
                <input
                  name="address"
                  value={contractor.address}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="text"
                  placeholder="Address"
                />
                <input
                  name="email"
                  value={contractor.email}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="email"
                  placeholder="Email Address"
                />
                <input
                  name="tin"
                  value={contractor.tin}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="text"
                  placeholder="TIN Number"
                />
                <input
                  name="amo"
                  value={contractor.amo}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="text"
                  placeholder="AMO"
                />
                <input
                  name="designation"
                  value={contractor.designation}
                  onChange={(e) => handleContractorChange(originalIndex, e)}
                  className="custom-input w-full"
                  type="text"
                  placeholder="Designation"
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default CreateContractors;
