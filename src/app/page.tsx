"use client";
import Link from "next/link";
import { 
  FaStamp, 
  FaExclamationCircle, 
  FaFileExcel, 
  FaEdit,
  FaShieldAlt,
  FaReceipt,
  FaUsers,
  FaDatabase,
  FaLayerGroup,
  FaFile,
  FaCheckSquare,
} from 'react-icons/fa'; // Import icons
import { MdSpaceDashboard } from "react-icons/md";

export default function Home() {
  const menuItems = [
    {
      icon: <MdSpaceDashboard className="w-6 h-6" />,
      title: "Dashboard",
      subtitle: "View contract statistics",
      href: "/dashboard",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Contractors",
      subtitle: "Manage contractor records",
      href: "/contractors",
    },
    {
      icon: <FaStamp className="w-6 h-6" />,
      title: "PIO Certification",
      subtitle: "Generate certification documents",
      href: "/create-pio-memo",
    },
    {
      icon: <FaEdit className="w-6 h-6" />,
      title: "Certification ni Amica",
      subtitle: "Generate PIO certification documents",
      href: "/create-pio-ney",
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
      icon: <FaCheckSquare className="w-6 h-6" />,
      title: "Checklist",
      subtitle: "Create Infrastructure contracts",
      href: "/checklist",
    },
    {
      icon: <FaLayerGroup className="w-6 h-6" />,
      title: "Update Multiple Contracts",
      subtitle: "Update Multiple Contracts at once",
      href: "/dashboard/update-multiple-contract",
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Bonds",
      subtitle: "Manage bond certificates",
      href: "/create-bond",
    },
    {
      icon: <FaFile className="w-6 h-6" />,
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
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Database",
      subtitle: "Manage SQL queries and backup",
      href: "/sqlite",
    },
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Localhost",
      subtitle: "Fetch data via localhost",
      href: "/fetch-data",
    },
  ];

  return (
    <div className="h-full mdmt-20 p-8">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className="group bg-gray-50 rounded-xl p-4 border-2 border-gray-50 hover:border-orange-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:shadow group-hover:bg-blue-50 text-gray-600 group-hover:text-orange-600">
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