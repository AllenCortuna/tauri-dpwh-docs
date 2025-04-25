"use client";
import React, { useEffect, useState, useRef } from "react";
import { Contract } from "./page";
import { invoke } from "@tauri-apps/api/core";

interface ContractTableProps {
  inputArr: Contract[];
  setInputArr: React.Dispatch<React.SetStateAction<Contract[]>>;
}

const ContractTable: React.FC<ContractTableProps> = ({ inputArr, setInputArr }) => {
  // State to manage form input data
  const [inputData, setInputData] = useState<Contract>({
    contractID: "",
    projectName: "",
  });

  // Destructure input data for easy access
  const { contractID, projectName } = inputData;
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const contractDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const result = await invoke('execute_mssql_query', {
          queryRequest: {
            query: "SELECT id, contractID, projectName, batch FROM contracts",
            params: []
          }
        });

        const contractsResult = (result as {rows: Contract[]}).rows;
        setContracts(contractsResult);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contractDropdownRef.current && !contractDropdownRef.current.contains(event.target as Node)) {
        setShowContractDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Filter contracts when typing in contractID field
    if (name === "contractID") {
      if (value.trim() === "") {
        setFilteredContracts([]);
        setShowContractDropdown(false);
      } else {
        const regex = new RegExp(value, "i");
        const filtered = contracts.filter(c => 
          regex.test(c.contractID) || regex.test(c.projectName)
        );
        setFilteredContracts(filtered);
        setShowContractDropdown(true);
      }
    }
  };

  // Handle adding new data to the input array
  const handleAdd = (): void => {
    if (contractID.trim() === "" || projectName.trim() === "") {
      return; // Don't add empty entries
    }
    
    setInputArr([
      ...inputArr,
      {
        contractID,
        projectName,
      },
    ]);

    // Reset input data
    setInputData({ contractID: "", projectName: "" });
  };

  // Handle deleting an item from the input array
  const handleDelete = (i: number): void => {
    const newdataArr = [...inputArr];
    newdataArr.splice(i, 1);
    setInputArr(newdataArr);
  };

  return (
    <div className="flex justify-center flex-col gap-5 max-w-[60rem] mx-auto">
      <span className="gap-5 flex mx-auto mt-10">
        <div className="relative">
          <input
            type="text"
            autoComplete="off"
            className="custom-input"
            name="contractID"
            value={inputData.contractID}
            onChange={handleChange}
            placeholder="Contract ID"
          />
          {showContractDropdown && filteredContracts.length > 0 && (
            <div 
              ref={contractDropdownRef}
              className="absolute z-10 w-[40rem] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredContracts.map((contract) => (
                <div
                  key={contract.contractID}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setInputData({
                      contractID: contract.contractID,
                      projectName: contract.projectName
                    });
                    setShowContractDropdown(false);
                  }}
                >
                  <div className="font-medium">{contract.contractID}</div>
                  <div className="text-xs text-gray-500 truncate">{contract.projectName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          autoComplete="off"
          className="custom-input w-[40rem]"
          name="projectName"
          value={inputData.projectName}
          onChange={handleChange}
          placeholder="Project Name"
        />
        <button
          onClick={handleAdd}
          type="submit"
          className="btn btn-sm btn-neutral text-xs w-40"
        >
          Add
        </button>
        <br />
      </span>

      <div className="flex flex-col mx-auto border border-zinc-300 rounded-lg mt-5">
        <table className="table table-zebra">
          <thead>
            <tr className="text-xs text-zinc-500">
              <th>Contract ID </th>
              <th>Project Name</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {inputArr.length < 1 ? (
              <tr>
                <td colSpan={3} className="text-red-500 text-xs"> Please enter atleast One Contract ID and Project Name!</td>
              </tr>
            ) : (
              inputArr.map((info, ind) => (
                <tr key={ind}>
                  <td className="text-xs">{info.contractID}</td>
                  <td className="text-xs text-zinc-600">{info.projectName}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(ind)}
                      className="btn btn-error btn-sm btn-outline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable;