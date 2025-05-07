"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../../config/toast";
import { invoke } from '@tauri-apps/api/core';
import useSelectDatabase from "../../../../config/useSelectDatabase";

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
  const { databaseType } = useSelectDatabase();
  const tableName = databaseType === 'goods' ? 'goods' : 'contracts';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    batch: string;
    year: string;
    posting: string;
    preBid: string;
    bidding: string;
  }>({
    batch: "",
    year: "",
    posting: "",
    preBid: "",
    bidding: "",
  });
  const [contracts, setContracts] = useState<Contract[]>([
    { contractID: "", projectName: "" },
  ]);

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

    if (Object.values(data).some((value) => value === "") && tableName !== 'goods') {
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

    if (data.year.length !== 4 || !/^\d+$/.test(data.year)) {
      errorToast("Invalid year. Please enter a 4-digit year.");
      return;
    }

    setIsLoading(true);
    try {
      for (const contract of contracts) {
        // Check if the contract already exists
        const existingContract = await invoke('execute_mssql_query', {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE contractID = @p1`,
            params: [contract.contractID]
          }
        });

        if ((existingContract as {rows: Contract[]}).rows.length > 0) {
          errorToast(`Contract with ID ${contract.contractID} already exists.`);
          return;
        }

        // Insert the new contract
        await invoke('execute_mssql_query', {
          queryRequest: {
            query: `INSERT INTO ${tableName} (
              batch, year, posting, preBid, bidding, contractID, projectName, status
            ) VALUES (
              @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8
            )`,
            params: [
              data.batch,
              data.year,
              data.posting,
              data.preBid,
              data.bidding,
              contract.contractID,
              contract.projectName,
              "posted"
            ]
          }
        });
      }

      setData({
        batch: "",
        year: "",
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
        className="flex flex-col gap-8 min-w-[60rem] mx-auto p-8 bg-white"
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
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Year:</p>
            <input
              name="year"
              value={data.year}
              onChange={handleData}
              className="custom-input w-52"
              type="text"
              placeholder=""
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
