"use client";

import React from "react";
// import Link from "next/link";
// import { FaFileContract, FaFileUpload } from "react-icons/fa";
import ExportContractors from "./contractor/ExportContractors";
import ExportContracts from "./contract/ExportContract";

export default function UploadXlsxPage() {
  // const menuItems = [
  //   {
  //     title: "Contract",
  //     description: "Upload and manage contract documents",
  //     icon: <FaFileContract className="text-4xl text-blue-600" />,
  //     href: "/upload-xlsx/contract",
  //     color: "bg-white hover:bg-blue-200",
  //   },
  //   {
  //     title: "Contractor",
  //     description: "Upload and manage list of contractors",
  //     icon: <FaFileUpload className="text-4xl text-green-600" />,
  //     href: "/upload-xlsx/contractor",
  //     color: "bg-white hover:bg-green-200",
  //   },
  // ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-20">
        <h1 className="text-2xl font-bold text-gray-800">
          Document Management
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Upload and manage your XLSX documents for contracts and projects
        </p>
      </div>

      <div className="flex flex-row justify-start items-start gap-40">
        <ExportContracts />
        <ExportContractors />
      </div>
    </div>
  );
}
