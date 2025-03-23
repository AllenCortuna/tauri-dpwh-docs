"use client";
import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import Database from "@tauri-apps/plugin-sql";

interface BidderData {
  name: string;
  address: string;
  telNo: string;
  philReg: string;
}

interface BidderTableProps {
  inputArr: BidderData[];
  setInputArr: React.Dispatch<React.SetStateAction<BidderData[]>>;
}

interface Contractor {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  tin: string;
  address: string;
}

const BidderTable: React.FC<BidderTableProps> = ({ inputArr, setInputArr }) => {
  // State to manage form input data
  const [inputData, setInputData] = useState<BidderData>({
    name: "",
    address: "",
    telNo: "",
    philReg: "",
  });

  // State for contractors and dropdown
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const contractorDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch contractors from database on component mount
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const db = await Database.load("sqlite:tauri.db");
        const contractorsResult = await db.select<Contractor[]>("SELECT * FROM contractors");
        setContractors(contractorsResult);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };

    fetchContractors();
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

  // Handle changes in form inputs
  const changehandle = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setInputData({
      ...inputData,
      [name]: value,
    });

    // Filter contractors when typing in name field
    if (name === "name") {
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
  };

  // Handle contractor selection from dropdown
  const handleContractorSelect = (contractor: Contractor) => {
    setInputData(prevData => ({
      ...prevData,
      name: contractor.contractorName,
      address: contractor.address || ""
    }));
    setShowContractorDropdown(false);
  };

  // Destructure input data for easy access
  const { name, address, telNo, philReg } = inputData;

  // Handle adding new data to the input array
  const handleAdd = (): void => {
    setInputArr([
      ...inputArr,
      {
        name,
        address,
        telNo,
        philReg,
      },
    ]);

    console.log(inputData, "input data what we Enter");

    // Reset input data
    setInputData({ name: "", address: "", telNo: "", philReg: "" });
  };

  // Handle deleting an item from the input array
  const handleDelete = (i: number): void => {
    const newdataArr = [...inputArr];
    newdataArr.splice(i, 1);
    setInputArr(newdataArr);
  };

  return (
    <div className="flex justify-start gap-20 max-w-[60rem] mx-auto mt-10">
      <span className="gap-5 flex flex-col mx-auto">
        <div className="relative">
          <input
            type="text"
            autoComplete="off"
            className="custom-input w-80"
            name="name"
            value={inputData.name}
            onChange={changehandle}
            placeholder="Name"
          />
          {showContractorDropdown && filteredContractors.length > 0 && (
            <div 
              ref={contractorDropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
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
        </div>
        <input
          type="text"
          autoComplete="off"
          className="custom-input w-80"
          name="address"
          value={inputData.address}
          onChange={changehandle}
          placeholder="Address"
        />
        <input
          type="text"
          autoComplete="off"
          className="custom-input w-80"
          name="telNo"
          value={inputData.telNo}
          onChange={changehandle}
          placeholder="Telephone Number"
        />
        <input
          type="text"
          autoComplete="off"
          className="custom-input w-80"
          name="philReg"
          value={inputData.philReg}
          onChange={changehandle}
          placeholder="PhilReg"
        />
        <button
          onClick={handleAdd}
          className="btn btn-sm border-2 rounded-full mx-auto btn-neutral text-xs w-32"
        >
          Submit
        </button>
        <br />
      </span>

      <div className="flex flex-col mx-auto rounded-lg">
        <div className="flex flex-col gap-4 text-xs">
          {inputArr.length < 1 ? (
            <div className="text-red-500 card border border-zinc-300 rounded-lg p-4">
              Please enter at least one Bidder Name, Address, Telephone Number, and
              PhilGEPs Registration NO!
            </div>
          ) : (
            inputArr.map((info, ind) => (
              <div
                key={ind}
                className="card border border-zinc-300 rounded-lg p-4 w-full"
              >
                <div className="text-xs text-zinc-600">
                  <strong>Bidder Name:</strong> {info.name}
                </div>
                <div className="text-xs text-zinc-600">
                  <strong>Tel NO:</strong> {info.telNo}
                </div>
                <div className="text-xs text-zinc-600">
                  <strong>PhilReg:</strong> {info.philReg}
                </div>
                <div className="text-xs text-zinc-600">
                  <strong>Address:</strong> {info.address}
                </div>
                <button
                  onClick={() => handleDelete(ind)}
                  className="btn btn-error btn-sm rounded-full btn-outline text-xs mt-5 w-20 mx-auto"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BidderTable;