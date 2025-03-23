"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ContractTable from "./ContractTable";
import Holidays from "date-holidays";
import { isWeekend } from "date-fns";
import CreatableSelect from "react-select/creatable";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { successToast, errorToast } from "../../../config/toast";

// Define interfaces for our data structures
export interface Contract {
  contractID: string;
  projectName: string;
}

interface FormData {
  certType: string;
  memoDate: string;
  startDate: string;
  endDate: string;
  certDate: string;
}
interface DocumentData {
  certType: string;
  memoDate: string;
  startDate: string;
  endDate: string;
  certDate: string;
  contracts: Contract[];
}

interface SelectOption {
  value: string;
  label: string;
}

const Folder: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputArr, setInputArr] = useState<Contract[]>([]);
  const [data, setData] = useState<FormData>({
    certType: "",
    memoDate: "",
    startDate: "",
    endDate: "",
    certDate: "",
  });

  const options: SelectOption[] = [
    { value: "Invitation to Bid", label: "Invitation to Bid" },
    { value: "Notice of Award", label: "Notice of Award" },
    { value: "Notice to Proceed", label: "Notice to Proceed" },
    { value: "Request for Quotation", label: "Request for Quotation" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = (selectedOption: SelectOption | null): void => {
    setData((prevData) => ({
      ...prevData,
      certType: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const hd = new Holidays("PH");
    const holiday = hd.isHoliday(new Date(value));
    if (isWeekend(new Date(value))) {
      toast.error("Dapat Monday to Friday lang!");
    } else if (holiday) {
      toast.error(`Bawal dahil ${holiday[0].name}!`);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
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

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (Object.values(data).some((value) => value === "") || !inputArr[0]) {
        toast.error("Hindi kumpleto ang mga input fields!");
      } else {
        //MEMO
        await generateDocument(
          "pioMemoTemplate",
          { ...data, contracts: inputArr, ...data },
          ` MEMO ${inputArr
            .slice(0, 5)
            .map((item) => item.contractID)
            .join(", ")} ${data.certType.toUpperCase()}.docx`
        );

        //CERT
        await generateDocument(
          "pioCertTemplate",
          {...data, contracts: inputArr,...data },
          ` CERT ${inputArr
           .slice(0, 5)
           .map((item) => item.contractID)
           .join(", ")} ${data.certType.toUpperCase()}.docx`
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log("ERROR: ", error);
      toast.error(String(error));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <ToastContainer />
      <form className="flex flex-col gap-8 min-w-[60rem] mx-auto">
        <CreatableSelect
          value={options.find((option) => option.value === data.certType)}
          onChange={handleSelect}
          options={options}
          isClearable
          className={"text-xs bg-zinc-200 w-[30rem]"}
          placeholder="Type of Document"
        />
        <div className="flex gap-10">
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Memo Date: </p>
            <input
              name="memoDate"
              value={data?.memoDate}
              onChange={handleDate}
              className="custom-input w-52"
              type="date"
            />
          </span>

          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Start Date: </p>
            <input
              name="startDate"
              value={data?.startDate}
              onChange={handleChange}
              className="custom-input w-52"
              type="date"
            />
          </span>

          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">End Date: </p>
            <input
              name="endDate"
              value={data?.endDate}
              onChange={handleChange}
              className="custom-input w-52"
              type="date"
            />
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Cert Date: </p>
            <input
              name="certDate"
              value={data?.certDate}
              onChange={handleDate}
              className="custom-input w-52"
              type="date"
            />
          </span>
        </div>
      </form>
      <ContractTable inputArr={inputArr} setInputArr={setInputArr} />
      <button
        type="submit"
        className={`btn ${
          isLoading ? "btn-disable" : "btn-neutral"
        } text-xs mt-10 w-60 mx-auto`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Compile Cert and Memo"}
      </button>
    </div>
  );
};

export default Folder;
