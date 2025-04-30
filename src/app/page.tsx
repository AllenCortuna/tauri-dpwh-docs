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
// import { useEffect } from 'react';
// import { 
//   isPermissionGranted, 
//   requestPermission, 
//   sendNotification 
// } from '@tauri-apps/plugin-notification';

export default function Home() {
  // useEffect(() => {
  //   const setupNotifications = async () => {
  //     // Request permission for notifications
  //     let permissionGranted = await isPermissionGranted();
  //     if (!permissionGranted) {
  //       const permission = await requestPermission();
  //       permissionGranted = permission === 'granted';
  //     }

  //     if (permissionGranted) {
  //       // Function to check time and send notification
  //       const checkTimeAndNotify = () => {
  //         const now = new Date();
  //         const hours = now.getHours();
  //         const minutes = now.getMinutes();
  //         console.log('now.get', now.getDate())

  //         // Check if it's 8:30 AM
  //         if (hours === 8 && minutes === 30) {
  //           sendNotification({
  //             title: 'Bidding Reminder',
  //             body: 'Good morning! Time to check your Procurement schedule.'
  //           });
  //         }
          
  //         // Check if it's 2:00 PM
  //         if (hours === 13 && minutes === 0) {
  //           sendNotification({
  //             title: 'Pre-Bid Reminder',
  //             body: 'Good afternoon! Time to review your afternoon tasks.'
  //           });
  //         }
  //       };

  //       // Run the check every minute
  //       const intervalId = setInterval(checkTimeAndNotify, 10000);

  //       // Cleanup interval on component unmount
  //       return () => clearInterval(intervalId);
  //     }
  //   };

  //   setupNotifications();
  // }, []);

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
      title: "Create Contracts",
      subtitle: "Create contracts information",
      href: "/sqlite",
    }
  ];

  return (
    <div className="h-full mdmt-20 p-8">
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