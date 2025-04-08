"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Database from "@tauri-apps/plugin-sql";

interface Contractor {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  designation: string;
  tin: string;
  address: string;
}

interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  batch: string;
}

const CreateNOA = () => {
  const [data, setData] = useState({
    fund: "",
    date: "",
    amount: "",
    contractor: "",
    contractorAddress: "",
    contractorTIN: "",
    contractID: "",
    pmis: "",
    contractName: "",
    labor: "",
    material: "",
    equipment: "",
    saro: "",
    sourceOfFund: "",
    uacs: "",
    year: "",
    endUser: "",
    designation: "",
    endUserTitle: "",
  });
  
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const contractorDropdownRef = useRef<HTMLDivElement>(null);
  const contractDropdownRef = useRef<HTMLDivElement>(null);

  // Load data from local storage on component mount and fetch contractors/contracts
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setData(JSON.parse(savedData) as typeof data);
    }
    
    const fetchData = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        
        // Fetch contractors
        const contractorsResult = await db.select<Contractor[]>("SELECT * FROM contractors");
        setContractors(contractorsResult);
        
        // Fetch contracts
        const contractsResult = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, batch FROM contracts"
        );
        setContracts(contractsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle click outside contractor dropdown to close it
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

  // Handle click outside contract dropdown to close it
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = {
      ...data,
      [name]: value,
    } as typeof data;

    // Save to local storage whenever input changes
    localStorage.setItem('formData', JSON.stringify(newData));

    setData(newData);
    
    // Filter contractors when typing in contractor field
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

  const handleContractorSelect = (contractor: Contractor) => {
    setData(prevData => ({
      ...prevData,
      contractor: contractor.contractorName,
      contractorAddress: contractor.address || "",
      contractorTIN: contractor.tin || ""
    }));
    setShowContractorDropdown(false);
  };
  
  const handleContractSelect = (contract: Contract) => {
    setData(prevData => ({
      ...prevData,
      contractID: contract.contractID,
      contractName: contract.projectName
    }));
    setShowContractDropdown(false);
  };

  return (
    <div className="flex justify-center">
      <form className="justify-center my-auto mt-10 flex flex-col gap-8 w-auto rounded-none shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-4 gap-8">

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Fund</span>
            <input
              name="fund"
              value={data.fund}
              onChange={handleChange}
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Date</span>
            <input
              name="date"
              value={data.date}
              onChange={handleChange}
              type="date"
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Amount</span>
            <input
              name="amount"
              value={data.amount}
              type="number"
              onChange={handleChange}
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">PMS ID</span>
            <input
              name="pmis"
              value={data.pmis}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contract ID</span>
            <input
              name="contractID"
              value={data.contractID}
              onChange={handleChange}
              className="custom-input"
              autoComplete="off"
            />
            {showContractDropdown && filteredContracts.length > 0 && (
              <div 
                ref={contractDropdownRef}
                className="absolute z-10 w-[26rem] mt-16 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-auto scroll-"
              >
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="px-4 py-2 hover:bg-gray-200 scroll-snap cursor-pointer text-sm"
                    onClick={() => handleContractSelect(contract)}
                  >
                    <div className="font-medium">{contract.contractID}</div>
                    <div className="text-xs text-gray-500 truncate">{contract.projectName}</div>
                  </div>
                ))}
              </div>
            )}
          </label>

          <label className="flex flex-col col-span-3 text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contract Name</span>
            <input
              name="contractName"
              value={data.contractName}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-2 gap-8">
          <label className="flex flex-col text-xs relative">
            <span className="text-xs text-zinc-500 mb-2">Contractor</span>
            <input
              name="contractor"
              value={data.contractor}
              onChange={handleChange}
              className="custom-input"
              autoComplete="off"
            />
            {showContractorDropdown && filteredContractors.length > 0 && (
              <div 
                ref={contractorDropdownRef}
                className="absolute z-10 w-full mt-16 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredContractors.map((contractor) => (
                  <div
                    key={contractor.id}
                    className="px-4 py-2 hover:bg-gray-200 snap-start cursor-pointer text-sm"
                    onClick={() => handleContractorSelect(contractor)}
                  >
                    <div className="font-medium">{contractor.contractorName}</div>
                    <div className="text-xs text-gray-500">{contractor.address}</div>
                    {contractor.tin && <div className="text-xs text-gray-500">TIN: {contractor.tin}</div>}
                  </div>
                ))}
              </div>
            )}
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">
              Contractor Address
            </span>
            <input
              name="contractorAddress"
              value={data.contractorAddress}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contractor TIN</span>
            <input
              name="contractorTIN"
              value={data.contractorTIN}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-3 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">End User</span>
            <input
              name="endUser"
              value={data.endUser}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Designation</span>
            <input
              name="designation"
              value={data.designation}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">End User Title</span>
            <input
              name="endUserTitle"
              value={data.endUserTitle}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-3 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Labor</span>
            <input
              name="labor"
              type="number"
              value={data.labor}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Material</span>
            <input
              name="material"
              type="number"
              value={data.material}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Equipment</span>
            <input
              name="equipment"
              type="number"
              value={data.equipment}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 border-t pt-5 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">SARO</span>
            <input
              name="saro"
              value={data.saro}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Source of Fund</span>
            <input
              name="sourceOfFund"
              value={data.sourceOfFund}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">UACS</span>
            <input
              name="uacs"
              value={data.uacs}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Year</span>
            <input
              name="year"
              value={data.year}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>
      </form>


      <span className="mb-5 ml-auto mr-0 flex flex-row gap-10 fixed bottom-10 right-10">

        <Link
          type="submit"
          target="_blank"
          rel="noopener noreferrer"
          href={`http://localhost:9527/create-oblig/pdf?${new URLSearchParams(
            data
          ).toString()}`}
          className="btn btn-neutral text-xs w-60 shadow-xl rounded-none"
        >
          Submit
        </Link>
      </span>
    </div>
  );
};

export default CreateNOA;