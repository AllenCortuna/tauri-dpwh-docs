"use client";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { errorToast, successToast } from "../../../config/toast";
import { formatDate } from "../../../config/convertToDate";
import Database from "@tauri-apps/plugin-sql";

interface FormData {
  contractID: string;
  projectName: string;
  location: string;
  date: string;
  representative: string;
  representativeDesignation: string;
  contractor: string;
  address: string;
}

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

const CreateBidReceipt = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<FormData>({
    contractID: "",
    projectName: "",
    location: "",
    date: "",
    representative: "",
    representativeDesignation: "",
    contractor: "",
    address: "",
  });
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const contractorDropdownRef = useRef<HTMLDivElement>(null);
  const contractDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch contractors and contracts from database on component mount
  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

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
      representative: contractor.amo || "",
      representativeDesignation: contractor.designation || "", // Default designation
      address: contractor.address || ""
    }));
    setShowContractorDropdown(false);
  };
  
  const handleContractSelect = (contract: Contract) => {
    setData(prevData => ({
      ...prevData,
      contractID: contract.contractID,
      projectName: contract.projectName
    }));
    setShowContractDropdown(false);
  };

  interface DocumentData {
    contractID: string;
    projectName: string;
    location: string;
    date: string;
    representative: string;
    representativeDesignation: string;
    contractor: string;
    address: string;
  }

  const generateDocument = async (
    templateName: string,
    dataToAdd: DocumentData,
    fileName: string
  ) => {
    try {
      // Fetch the template file from the public folder
      const templatePath = `/${templateName}.docx`;
      const response = await fetch(templatePath);
      const templateBlob = await response.blob();

      // Convert the Blob to binary data
      const reader = new FileReader();
      reader.readAsBinaryString(templateBlob);
      reader.onload = () => {
        const binaryData = reader.result as string;

        // Load the template into docxtemplater
        const zip = new PizZip(binaryData);
        const doc = new Docxtemplater(zip);
        doc.setData(dataToAdd);

        try {
          // Render the document
          doc.render();

          // Generate the output document as a Blob
          const out = doc.getZip().generate({ type: "blob" });

          // Trigger the download
          const url = window.URL.createObjectURL(out);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          successToast(`${fileName} downloaded successfully`);
        } catch (error) {
          console.error("Error rendering document:", error);
          errorToast(`Failed to generate ${fileName}`);
        }
      };
    } catch (error) {
      console.error("Error fetching template:", error);
      errorToast(`Failed to fetch template for ${fileName}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (Object.values(data).some((value) => value === "")) {
        errorToast("Hindi kumpleto ang mga input fields!");
        return;
      }

      const commonData = {
        ...data,
        date: formatDate(data.date),
      };

      // Generate Transmittal Document
      await generateDocument(
        "bidReceiptTemplate",
        commonData,
        `${data.contractor} ${data.contractID} BID RECEIPT.docx`
      );
    } catch (error) {
      console.error("Error processing request:", error);
      errorToast("Failed to process the request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <ToastContainer />
      <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 min-w-[60rem] mx-auto bg-white p-10">
        <div className="relative">
          <input
            name="contractID"
            value={data.contractID}
            onChange={handleChange}
            placeholder="Contract ID"
            className="custom-input"
            type="text"
            autoComplete="off"
          />
          {showContractDropdown && filteredContracts.length > 0 && (
            <div 
              ref={contractDropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
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
        </div>
        <div className="relative col-span-2">
          <input
            name="contractor"
            value={data.contractor}
            onChange={handleChange}
            placeholder="Contractor"
            className="custom-input w-full"
            type="text"
            autoComplete="off"
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
                  <div className="text-xs text-gray-500">{contractor.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          name="projectName"
          value={data.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          className="custom-input col-span-3"
          type="text"
        />
        <input
          name="location"
          value={data.location}
          onChange={handleChange}
          placeholder="Location"
          className="custom-input"
          type="text"
        />
        <input
          name="representative"
          value={data.representative}
          onChange={handleChange}
          placeholder="Representative"
          className="custom-input"
          type="text"
        />
        <input
          name="representativeDesignation"
          value={data.representativeDesignation}
          onChange={handleChange}
          placeholder="Representative Designation"
          className="custom-input"
        />
        <input
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Contractor Address"
          className="custom-input col-span-2"
          type="text"
        />
        <span className="tooltip" data-tip="Date of Report">
          <input
            name="date"
            value={data.date}
            onChange={handleChange}
            className="custom-input"
            type="date"
          />
        </span>
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
    </div>
  );
};

export default CreateBidReceipt;
