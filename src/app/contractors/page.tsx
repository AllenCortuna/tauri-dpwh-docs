"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUsers, FaUserTie, FaBuilding } from "react-icons/fa";
import { BsPersonVcard } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
// Update imports at the top
import ContractorNav from "../components/ContractorNav";

// Remove these imports as they're no longer needed here
// import Link from "next/link";
// import { FaPlus, FaSearch, FaHome } from "react-icons/fa";

interface ContractorStats {
  totalContractors: number;
  totalWithEmail: number;
  totalWithTIN: number;
  totalWithAMO: number;
  totalWithDesignation: number;
}

interface Contractor {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  designation: string;
  tin: string;
  address: string;
  lastUpdated: string;
}

const ContractorsDashboard: React.FC = () => {
  const [stats, setStats] = useState<ContractorStats>({
    totalContractors: 0,
    totalWithEmail: 0,
    totalWithTIN: 0,
    totalWithAMO: 0,
    totalWithDesignation: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentContractors, setRecentContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    const fetchContractorStats = async () => {
      try {
        setIsLoading(true);
        const db = await Database.load("sqlite:tauri.db");

        // Get total contractors
        const totalContractorsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors"
        );

        // Get contractors with email
        const withEmailResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors WHERE email IS NOT NULL AND email != ''"
        );

        // Get contractors with TIN
        const withTINResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors WHERE tin IS NOT NULL AND tin != ''"
        );

        // Get contractors with AMO
        const withAMOResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors WHERE amo IS NOT NULL AND amo != ''"
        );

        // Get contractors with Designation
        const withDesignationResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors WHERE designation IS NOT NULL AND designation != ''"
        );

        // Get recent contractors
        const recentContractorsResult = await db.select<Contractor[]>(
          "SELECT * FROM contractors ORDER BY lastUpdated DESC LIMIT 5"
        );

        setStats({
          totalContractors: totalContractorsResult[0]?.count || 0,
          totalWithEmail: withEmailResult[0]?.count || 0,
          totalWithTIN: withTINResult[0]?.count || 0,
          totalWithAMO: withAMOResult[0]?.count || 0,
          totalWithDesignation: withDesignationResult[0]?.count || 0,
        });

        setRecentContractors(recentContractorsResult);
      } catch (error) {
        console.error("Error fetching contractor stats:", error);
        toast.error("Failed to fetch contractor statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractorStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex justify-between items-center mb-8 w-full">
          <ContractorNav />
          <h1 className="text-2xl font-bold text-gray-700">Contractors Dashboard</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Contractors Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-xs mb-2">
                    Total Contractors
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {stats.totalContractors}
                  </p>
                </div>
                <FaUsers className="text-4xl text-indigo-600 opacity-70" />
              </div>
            </div>

            {/* Contractors with Email */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-xs mb-2">With Email</h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {stats.totalWithEmail}
                  </p>
                </div>
                <MdEmail className="text-4xl text-emerald-600 opacity-70" />
              </div>
            </div>

            {/* Contractors with TIN */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-xs mb-2">With TIN</h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {stats.totalWithTIN}
                  </p>
                </div>
                <BsPersonVcard className="text-4xl text-amber-600 opacity-70" />
              </div>
            </div>

            {/* Contractors with AMO */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fuchsia-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-xs mb-2">With AMO</h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {stats.totalWithAMO}
                  </p>
                </div>
                <FaUserTie className="text-4xl text-fuchsia-600 opacity-70" />
              </div>
            </div>

            {/* Contractors with Designation */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-xs mb-2">
                    With Designation
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {stats.totalWithDesignation}
                  </p>
                </div>
                <FaBuilding className="text-4xl text-rose-600 opacity-70" />
              </div>
            </div>
          </div>

          {/* Recent Contractors Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-7">
              Recently Updated Contractors
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-xs text-neutral">
                    <th className="px-6 py-3 text-left">Contractor Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">AMO</th>
                    <th className="px-6 py-3 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                  {recentContractors.map((contractor) => (
                    <tr key={contractor.id}>
                      <td className="px-6 py-4 uppercase font-semibold text-zinc-600">
                        {contractor.contractorName}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {contractor.email}
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-500">
                        {contractor.amo}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(contractor.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default ContractorsDashboard;
