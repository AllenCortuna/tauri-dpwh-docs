"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Database from "@tauri-apps/plugin-sql";

interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  batch: string;
}

// Add new interface for Contractor
interface Contractor {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  tin: string;
  address: string;
}

const CreateBonds = () => {
  const [data, setData] = useState({
    contractID: "",
    insuranceCompany: "",
    dateValidated: "",
    amount: "",
    contractor: "",
    projectNo: "",
    projectName: "",
    theWho: "",
    designation: "",
    bondType: "",
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const contractDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch contracts from database
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        const contractsResult = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, batch FROM contracts"
        );
        setContracts(contractsResult);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  // Handle click outside dropdown
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

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) setData(JSON.parse(storedData));
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  // Add new states for contractor dropdown
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const contractorDropdownRef = useRef<HTMLDivElement>(null);

  // Modify existing useEffect to fetch both contracts and contractors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        const contractsResult = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, batch FROM contracts"
        );
        setContracts(contractsResult);
        
        // Add contractors fetch
        const contractorsResult = await db.select<Contractor[]>("SELECT * FROM contractors");
        setContractors(contractorsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Add new useEffect for contractor dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contractorDropdownRef.current && !contractorDropdownRef.current.contains(event.target as Node)) {
        setShowContractorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Modify handleChange to include contractor filtering
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "contractor") {
      if (value.trim() === "") {
        setFilteredContractors([]);
        setShowContractorDropdown(false);
      } else {
        const regex = new RegExp(value, "i");
        const filtered = contractors.filter(c => 
          regex.test(c.contractorName)
        );
        setFilteredContractors(filtered);
        setShowContractorDropdown(true);
      }
    }
    // Filter contracts when typing in contractID field
    if (name === "contractID") {
      if (value.trim() === "") {
        setFilteredContracts([]);
        setShowContractDropdown(false);
      } else {
        const regex = new RegExp(value, "i");
        const filtered = contracts.filter(c => 
          regex.test(c.contractID)
        );
        setFilteredContracts(filtered);
        setShowContractDropdown(true);
      }
    }
  };

  const handleContractSelect = (contract: Contract) => {
    setData(prevData => ({
      ...prevData,
      contractID: contract.contractID,
      projectName: contract.projectName
    }));
    setShowContractDropdown(false);
  };

  // Add handleContractorSelect function
  const handleContractorSelect = (contractor: Contractor) => {
    setData(prevData => ({
      ...prevData,
      contractor: contractor.contractorName
    }));
    setShowContractorDropdown(false);
  };

  // In the JSX, modify the contractor input field:
  return (
    <div className="flex w-screen p-20 justify-center">
      <form className="justify-center flex flex-col gap-8 mt-10 w-auto rounded-xl shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col relative">
            <span className="text-xs text-zinc-500 mb-2">Contract ID</span>
            <input
              name="contractID"
              value={data.contractID}
              onChange={handleChange}
              className="custom-input"
              required
              autoComplete="off"
            />
            {showContractDropdown && filteredContracts.length > 0 && (
              <div 
                ref={contractDropdownRef}
                className="absolute z-10 w-full mt-1 top-[100%] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleContractSelect(contract)}
                  >
                    <div className="font-medium">{contract.contractID}</div>
                    <div className="text-xs text-gray-500 truncate">{contract.projectName}</div>
                  </div>
                ))}
              </div>
            )}
          </label>

          <label className="flex flex-col col-span-3">
            <span className="text-xs text-zinc-500 mb-2">Project Name</span>
            <input
              name="projectName"
              value={data.projectName}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>
        </span>

        <div className="grid grid-cols-2 gap-8">
          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Bond NO</span>
            <input
              name="projectNo"
              value={data.projectNo}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">
              Insurance Company
            </span>
            <input
              name="insuranceCompany"
              value={data.insuranceCompany}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col relative">
            <span className="text-xs text-zinc-500 mb-2">Contractor</span>
            <input
              name="contractor"
              value={data.contractor}
              onChange={handleChange}
              className="custom-input"
              required
              autoComplete="off"
            />
            {showContractorDropdown && filteredContractors.length > 0 && (
              <div 
                ref={contractorDropdownRef}
                className="absolute z-10 w-full mt-1 top-[100%] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredContractors.map((contractor) => (
                  <div
                    key={contractor.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleContractorSelect(contractor)}
                  >
                    <div className="font-medium">{contractor.contractorName}</div>
                    <div className="text-xs text-gray-500 truncate">{contractor.address}</div>
                  </div>
                ))}
              </div>
            )}
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Amount</span>
            <input
              name="amount"
              type="number"
              value={data.amount}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">The Who</span>
            <input
              name="theWho"
              value={data.theWho}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Date Validated</span>
            <input
              name="dateValidated"
              value={data.dateValidated}
              type="date"
              onChange={handleChange}
              className="custom-input tooltip-top"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Designation</span>
            <input
              name="designation"
              value={data.designation}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Bond Type</span>
            <select
              name="bondType"
              value={data.bondType}
              onChange={handleChange}
              className="custom-input"
              required
            >
              <option value="">Select Bond Type</option>
              <option value="PERFORMANCE BOND">PERFORMANCE BOND</option>
              <option value="CONTRACTOR'S ALL RISK POLICY">CONTRACTOR&apos;S ALL RISK POLICY</option>
              <option value="ADVANCE PAYMENT BOND">ADVANCE PAYMENT BOND</option>
              <option value="RETENTION BOND">RETENTION BOND</option>
              <option value="WARRANTY BOND">WARRANTY BOND</option>
            </select>
          </label>

        </div>

        <span className="mb-5 ml-auto mr-0 flex flex-row gap-10 justify-start ">
          <Link
            href={`http://localhost:9527/create-bond/pdf?${new URLSearchParams(data).toString()}`}
            className="btn btn-neutral text-xs w-60"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit Bond
          </Link>
        </span>
      </form>
    </div>
  );
};

export default CreateBonds;
