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
  FaPen,
  FaBookmark,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import useShowFab from '../../config/useShowFab';

export default function Home() {
  const { showFab } = useShowFab();
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
      title: "Amica Cert",
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
      title: "Export Excel",
      subtitle: "Export data to xls files",
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
      title: "Update Contracts",
      subtitle: "Update multiple contracts at once",
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
      title: "Settings",
      subtitle: "Database settings",
      href: "/settings",
    },
  ];

  return (
    <div className="h-full mdmt-20 p-8">
      {showFab && (
        <div className="fixed bottom-5 right-5 flex flex-col gap-5">
          <Link
            href="/dashboard/create-contract"
            className="p-3 rounded-lg bg-gray-50 shadow hover:bg-blue-50 text-gray-600 hover:text-orange-600 tooltip tooltip-left"
            data-tip="Add new contracts"
          >
            <RiAddCircleFill className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/update-contract"
            className="p-3 rounded-lg bg-gray-50 shadow hover:bg-blue-50 text-gray-600 hover:text-orange-600 tooltip tooltip-left"
            data-tip="Update Contracts"
          >
            <FaPen className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/search-contract"
            className="p-3 rounded-lg bg-gray-50 shadow hover:bg-blue-50 text-gray-600 hover:text-orange-600 tooltip tooltip-left"
            data-tip="Search Contracts"
          >
            <FaBookmark className="w-5 h-5" />
          </Link>
          <Link
            href="/contractors/search"
            className="p-3 rounded-lg bg-gray-50 shadow hover:bg-blue-50 text-gray-600 hover:text-orange-600 tooltip tooltip-left"
            data-tip="Search Contractors"
          >
            <FaUsers className="w-5 h-5" />
          </Link>
        </div>
      )}
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
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
