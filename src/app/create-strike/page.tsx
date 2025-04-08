"use client";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import BidderTable from "../components/BidderTable";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { errorToast, successToast } from "../../../config/toast";
import { formatNumber } from "../../../config/formatNumber";
import { formatDate } from "../../../config/convertToDate";
import Database from "@tauri-apps/plugin-sql";

interface Bidder {
  name: string;
  address: string;
  telNo: string;
  philReg: string;
}

interface FormData {
  contractID: string;
  contractName: string;
  budget: string;
  date: string;
  category: string;
  bidders?: Bidder[];
}
interface DocumentData {
  contractID: string;
  contractName: string;
  budget: string;
  date: string;
  category: string;
  endUser?: string;
  endID?: string;
  endDesignation?: string;
  bidders?: Bidder[];
  name?: string;
  address?: string;
  telNo?: string;
  philReg?: string;
}


interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  batch: string;
}

const Create3Strike = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputArr, setInputArr] = useState<Bidder[]>([]);
  const [data, setData] = useState<FormData>({
    contractID: "",
    contractName: "",
    budget: "",
    date: "",
    category: "",
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const contractDropdownRef = useRef<HTMLDivElement>(null);

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

  const options = [
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Goods and Services", label: "Goods and Services" },
    { value: "Consultancy", label: "Consultancy" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
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
        const filtered = contracts.filter(
          (c) => regex.test(c.contractID) || regex.test(c.projectName)
        );
        setFilteredContracts(filtered);
        setShowContractDropdown(true);
      }
    }
  };

  type SelectOption = { value: string; label: string } | null;
  const handleSelect = (selectedOption: SelectOption) => {
    setData((prevData) => ({
      ...prevData,
      category: selectedOption ? selectedOption.value : "",
    }));
  };


  const generateDocument = async (
    templateName: string,
    dataToAdd: DocumentData,
    fileName: string
  ) => {
    try {
      // Fetch the template file from the public folder
      const templatePath = `/3-STRIKE/${templateName}.docx`;
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
      if (Object.values(data).some((value) => value === "") || !inputArr[0]) {
        errorToast("Hindi kumpleto ang mga input fields!");
        return;
      }

      const isGood = data.category === "Goods and Services";
      const commonData = {
        ...data,
        budget: formatNumber(data.budget),
        date: formatDate(data.date),
        endUser: isGood ? "KATHERINE V. LADAGA" : "EDISON M. SALAZAR",
        endID: isGood ? "12 G 0106" : "86 G 0033",
        endDesignation: isGood
          ? "End User for Goods"
          : "End-user for Construction / Maintenance and Consultancy Projects",
      };

      // Generate Strike Document
      await generateDocument(
        "strike",
        {
          ...commonData,
          bidders: inputArr.map((item, index) => ({
            ...item,
            id: index + 1,
          })),
        },
        `${data.contractID} STRIKE.docx`
      );

      // Generate Transmittal Document
      await generateDocument(
        "transmittal",
        commonData,
        `${data.contractID} TRANSMITTAL.docx`
      );

      // Generate Individual Documents
      for (const bidder of inputArr) {
        await generateDocument(
          "individual",
          { ...commonData, ...bidder },
          `${data.contractID} ${bidder.name} STRIKE FORM.docx`
        );
      }
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
      <form className="flex flex-col gap-8 min-w-[60rem] mx-auto">
        <div className="flex gap-10">
          <div className="relative">
            <input
              name="contractID"
              value={data.contractID}
              onChange={handleChange}
              placeholder="Contract ID"
              className="custom-input w-48"
              type="text"
              autoComplete="off"
            />
            {showContractDropdown && filteredContracts.length > 0 && (
              <div
                ref={contractDropdownRef}
                className="absolute z-10 w-[40rem] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setData((prevData) => ({
                        ...prevData,
                        contractID: contract.contractID,
                        contractName: contract.projectName,
                      }));
                      setShowContractDropdown(false);
                    }}
                  >
                    <div className="font-medium">{contract.contractID}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {contract.projectName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <CreatableSelect
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
      <BidderTable inputArr={inputArr} setInputArr={setInputArr} />
      <button
        type="submit"
        className={`btn fixed bottom-10 left-1/2 transform -translate-x-1/2 ${
          isLoading ? "loading btn-disabled" : "btn-neutral"
        } text-xs w-80`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Download Documents"}
      </button>
    </div>
  );
};

export default Create3Strike;
