"use client";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { errorToast, successToast } from "../../../config/toast";
import { formatDate } from "../../../config/convertToDate";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        `${data.contractID} ${data.contractor} BID RECEIPT.docx`
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
      <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 min-w-[60rem] mx-auto">
        <input
          name="contractID"
          value={data.contractID}
          onChange={handleChange}
          placeholder="Contract ID"
          className="custom-input"
          type="text"
        />
        <input
          name="contractor"
          value={data.contractor}
          onChange={handleChange}
          placeholder="Contractor"
          className="custom-input col-span-2"
          type="text"
        />
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
