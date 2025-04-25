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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* {menuItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="flex justify-center items-center p-6"
          >
            <div className={`${item.color} rounded-lg p-6 shadow-md transition-all duration-300 transform hover:scale-105 w-full`}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {item.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              </div>
            </div>
          </Link>
        ))} */}
        <ExportContractors />
        <ExportContracts />
      </div>
    </div>
  );
}
