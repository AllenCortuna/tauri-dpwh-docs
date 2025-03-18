"use client";
import Link from "next/link";
import { 
  FaCertificate, 
  FaExclamationTriangle, 
  FaFileExcel, 
  FaFileContract, 
  FaPencilAlt,
  FaHandHoldingUsd,
  FaMoneyCheckAlt,
  FaReceipt
} from 'react-icons/fa'; // Import icons

export default function Home() {
  const menuItems = [
    {
      icon: <FaCertificate className="w-6 h-6" />,
      title: "PIO Certification",
      subtitle: "Generate certification documents",
      href: "/create-pio-cert",
    },
    {
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      title: "3 Strike Policy",
      subtitle: "Manage compliance warnings",
      href: "/create-strike",
    },
    {
      icon: <FaFileExcel className="w-6 h-6" />,
      title: "Upload Excel",
      subtitle: "Upload Excel files",
      href: "/upload-xlsx",
    },
    {
      icon: <FaFileContract className="w-6 h-6" />,
      title: "Contract",
      subtitle: "Create Infrastructure contracts",
      href: "/create-contract",
    },
    {
      icon: <FaPencilAlt className="w-6 h-6" />,
      title: "Update Contract",
      subtitle: "Update Infrastructure contracts",
      href: "/update-contract",
    },
    {
      icon: <FaHandHoldingUsd className="w-6 h-6" />,
      title: "Bonds",
      subtitle: "Manage bond certificates",
      href: "/create-bond",
    },
    {
      icon: <FaMoneyCheckAlt className="w-6 h-6" />,
      title: "Obligations",
      subtitle: "Handle obligation records",
      href: "/create-oblig",
    },
    {
      icon: <FaReceipt className="w-6 h-6" />,
      title: "Bid Receipt",
      subtitle: "Create bid receipts",
      href: "/create-bid-receipt",
    },
  ];

  return (
    <div className="h-full mdmt-20 p-8">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className="group bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 text-gray-600 group-hover:text-blue-600">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {item.title}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}