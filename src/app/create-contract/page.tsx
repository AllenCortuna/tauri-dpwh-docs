"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../config/toast";
import Database from "@tauri-apps/plugin-sql";

interface Contract {
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

const CreateContracts: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    batch: string;
    posting: string;
    preBid: string;
    bidding: string;
  }>({
    batch: "",
    posting: "",
    preBid: "",
    bidding: "",
  });
  const [contracts, setContracts] = useState<Contract[]>([
    { contractID: "", projectName: "" },
  ]);

  // Initialize the database and create the table if it doesn't exist
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Connect to SQLite instead of MySQL
        const db = await Database.load("sqlite:tauri.db");
        
        // Create the contracts table if it doesn't exist
        await db.execute(`
          CREATE TABLE IF NOT EXISTS contracts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch TEXT NOT NULL,
            posting TEXT NOT NULL,
            preBid TEXT NOT NULL,
            bidding TEXT NOT NULL,
            contractID TEXT NOT NULL UNIQUE,
            projectName TEXT NOT NULL,
            status TEXT NOT NULL,
            contractAmount TEXT,
            contractor TEXT,
            bidEvalStart TEXT,
            bidEvalEnd TEXT,
            postQualStart TEXT,
            postQualEnd TEXT,
            reso TEXT,
            noa TEXT,
            ntp TEXT,
            ntpRecieve TEXT,
            contractDate TEXT,
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

  const handleData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContractChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedContracts = contracts.map((contract, i) =>
      i === index ? { ...contract, [name]: value } : contract
    );
    setContracts(updatedContracts);
  };

  const addContract = () => {
    setContracts([...contracts, { contractID: "", projectName: "" }]);
  };

  const removeContract = (index: number) => {
    setContracts(contracts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(data).some((value) => value === "")) {
      errorToast("Please fill in all fields.");
      return;
    }

    if (
      contracts.some(
        (contract) => contract.contractID === "" || contract.projectName === ""
      )
    ) {
      errorToast("Please fill in all contract fields.");
      return;
    }

    setIsLoading(true);
    try {
      const db = await Database.load("sqlite:tauri.db");
  
      for (const contract of contracts) {
        await db.execute(
          `INSERT INTO contracts (
            batch, posting, preBid, bidding, contractID, projectName, status,
            contractAmount, contractor, bidEvalStart, bidEvalEnd, postQualStart,
            postQualEnd, reso, noa, ntp, ntpRecieve, contractDate, lastUpdated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.batch,
            data.posting,
            data.preBid,
            data.bidding,
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

      setData({
        batch: "",
        posting: "",
        preBid: "",
        bidding: "",
      });
      setContracts([{ contractID: "", projectName: "" }]);
      successToast("Contracts submitted successfully!");
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
    <div className="flex flex-col w-screen p-10 justify-center">
      <form
        className="flex flex-col gap-8 min-w-[60rem] mx-auto mt-20"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-10">
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Posting Date:</p>
            <input
              name="posting"
              value={data.posting}
              onChange={handleData}
              className="custom-input w-52"
              type="date"
            />
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Pre Bid Date:</p>
            <input
              name="preBid"
              value={data.preBid}
              onChange={handleData}
              className="custom-input w-52"
              type="date"
            />
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Bidding Date:</p>
            <input
              name="bidding"
              value={data.bidding}
              onChange={handleData}
              className="custom-input w-52"
              type="date"
            />
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Batch NO:</p>
            <input
              name="batch"
              value={data.batch}
              onChange={handleData}
              className="custom-input w-52"
              type="text"
            />
          </span>
        </div>

        {contracts.map((contract, index) => (
          <div key={index} className="flex gap-10 items-center">
            <input
              type="text"
              autoComplete="off"
              className="custom-input w-40"
              name="contractID"
              value={contract.contractID}
              onChange={(e) => handleContractChange(index, e)}
              placeholder="Contract ID"
            />
            <input
              type="text"
              autoComplete="off"
              className="custom-input w-full"
              name="projectName"
              value={contract.projectName}
              onChange={(e) => handleContractChange(index, e)}
              placeholder="Project Name"
            />
            <button
              type="button"
              className="btn btn-error text-white btn-sm text-xs"
              onClick={() => removeContract(index)}
              disabled={contracts.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-neutral text-xs mt-5 mr-auto ml-0"
          onClick={addContract}
        >
          Add Contract
        </button>

        <button
          type="submit"
          className={`btn ${
            isLoading ? "btn-disable" : "btn-neutral"
          } text-xs mt-10 w-52 mx-auto fixed bottom-5 right-5`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit Contracts"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CreateContracts;