"use client";
import Link from "next/link";
import { 
  FaStamp, 
  FaExclamationCircle, 
  FaFileExcel, 
  FaFileSignature, 
  FaEdit,
  FaShieldAlt,
  FaMoneyBill,
  FaReceipt,
  FaUsers,
  FaDatabase
} from 'react-icons/fa'; // Import icons

export default function Home() {
  const menuItems = [
    {
      icon: <FaStamp className="w-6 h-6" />,
      title: "PIO Certification",
      subtitle: "Generate certification documents",
      href: "/create-pio-cert",
    },
    {
      icon: <FaExclamationCircle className="w-6 h-6" />,
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
      icon: <FaFileSignature className="w-6 h-6" />,
      title: "Contract",
      subtitle: "Create Infrastructure contracts",
      href: "/create-contract",
    },
    {
      icon: <FaEdit className="w-6 h-6" />,
      title: "Update Contract",
      subtitle: "Update Infrastructure contracts",
      href: "/update-contract",
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Bonds",
      subtitle: "Manage bond certificates",
      href: "/create-bond",
    },
    {
      icon: <FaMoneyBill className="w-6 h-6" />,
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
    //contractors
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Contractors",
      subtitle: "Manage contractor records",
      href: "/contractors",
    },
    //sql
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Database",
      subtitle: "Manage SQL queries and backup",
      href: "/sqlite",
    },
  ];

  return (
    <div className="h-full mdmt-20 p-8">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className="group bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-orange-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 text-gray-600 group-hover:text-orange-600">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 group-hover:text-orange-600">
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