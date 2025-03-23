"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  contractor?: string;
  status: string;
  bidding: string;
}

interface DashboardStats {
  totalContracts: number;
  totalContractors: number;
  totalAwardedCurrentYear: number;
  totalPostedCurrentYear: number;
  totalProceedCurrentYear: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContracts: 0,
    totalContractors: 0,
    totalAwardedCurrentYear: 0,
    totalPostedCurrentYear: 0,
    totalProceedCurrentYear: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentYear, setCurrentYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [postedContracts, setPostedContracts] = useState<Contract[]>([]);
  const [awardedContracts, setAwardedContracts] = useState<Contract[]>([]);
  const [proceedContracts, setProceedContracts] = useState<Contract[]>([]);
  const [activeTab, setActiveTab] = useState<'posted' | 'awarded' | 'proceed'>('posted');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const db = await Database.load("sqlite:tauri.db");

        // Get total contracts
        const totalContractsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contracts"
        );
        
        // Get total contractors
        const totalContractorsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contractors"
        );
        
        // Get awarded contracts for current year
        const awardedContractsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contracts WHERE status = 'awarded' AND year = ?",
          [currentYear]
        );
        
        // Get posted contracts for current year
        const postedContractsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contracts WHERE status = 'posted' AND year = ?",
          [currentYear]
        );
        
        // Get proceed contracts for current year
        const proceedContractsResult = await db.select<[{ count: number }]>(
          "SELECT COUNT(*) as count FROM contracts WHERE status = 'proceed' AND year = ?",
          [currentYear]
        );

        // Fetch the actual contract lists
        const postedContractsList = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, contractor, status, bidding FROM contracts WHERE status = 'posted' AND year = ? ORDER BY bidding DESC LIMIT 10",
          [currentYear]
        );
        
        const awardedContractsList = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, contractor, status, bidding FROM contracts WHERE status = 'awarded' AND year = ? ORDER BY bidding DESC LIMIT 10",
          [currentYear]
        );
        
        const proceedContractsList = await db.select<Contract[]>(
          "SELECT id, contractID, projectName, contractor, status, bidding FROM contracts WHERE status = 'proceed' AND year = ? ORDER BY bidding DESC LIMIT 10",
          [currentYear]
        );

        setStats({
          totalContracts: totalContractsResult[0]?.count || 0,
          totalContractors: totalContractorsResult[0]?.count || 0,
          totalAwardedCurrentYear: awardedContractsResult[0]?.count || 0,
          totalPostedCurrentYear: postedContractsResult[0]?.count || 0,
          totalProceedCurrentYear: proceedContractsResult[0]?.count || 0,
        });

        setPostedContracts(postedContractsList);
        setAwardedContracts(awardedContractsList);
        setProceedContracts(proceedContractsList);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to fetch dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [currentYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(e.target.value);
  };

  // Generate year options (current year and 5 years back)
  const currentYearNum = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYearNum - i);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <label htmlFor="year" className="mr-2 text-gray-700">Year:</label>
          <select
            id="year"
            value={currentYear}
            onChange={handleYearChange}
            className="custom-input w-32"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Contracts Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h2 className="text-gray-500 text-sm uppercase mb-2">Total Contracts</h2>
              <p className="text-3xl font-bold text-gray-800">{stats.totalContracts}</p>
            </div>

            {/* Total Contractors Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h2 className="text-gray-500 text-sm uppercase mb-2">Total Contractors</h2>
              <p className="text-3xl font-bold text-gray-800">{stats.totalContractors}</p>
            </div>

            {/* Current Year Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 md:col-span-2 lg:col-span-1">
              <h2 className="text-gray-500 text-sm uppercase mb-4">
                {currentYear} Contract Status
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold text-gray-800">{stats.totalPostedCurrentYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Awarded</span>
                  <span className="font-semibold text-gray-800">{stats.totalAwardedCurrentYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Proceed</span>
                  <span className="font-semibold text-gray-800">{stats.totalProceedCurrentYear}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="font-bold text-gray-800">
                    {stats.totalPostedCurrentYear + 
                     stats.totalAwardedCurrentYear + 
                     stats.totalProceedCurrentYear}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Lists Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="flex border-b mb-4">
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'posted' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('posted')}
              >
                Posted
              </button>
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'awarded' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('awarded')}
              >
                Awarded
              </button>
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'proceed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('proceed')}
              >
                With NTP
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                  {activeTab === 'posted' && postedContracts.length > 0 ? (
                    postedContracts.map((contract) => (
                      <tr key={contract.id}>
                        <td className="px-6 py-4 text-gray-900">{contract.contractID}</td>
                        <td className="px-6 py-4 text-gray-500">{contract.projectName}</td>
                      </tr>
                    ))
                  ) : activeTab === 'awarded' && awardedContracts.length > 0 ? (
                    awardedContracts.map((contract) => (
                      <tr key={contract.id}>
                        <td className="px-6 py-4 text-gray-900">{contract.contractID}</td>
                        <td className="px-6 py-4 text-gray-500">{contract.projectName}</td>
                        <td className="px-6 py-4 text-gray-500">{contract.contractor || 'N/A'}</td>
                      </tr>
                    ))
                  ) : activeTab === 'proceed' && proceedContracts.length > 0 ? (
                    proceedContracts.map((contract) => (
                      <tr key={contract.id}>
                        <td className="px-6 py-4 text-gray-900">{contract.contractID}</td>
                        <td className="px-6 py-4 text-gray-500">{contract.projectName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No contracts found for this status.
                      </td>
                    </tr>
                  )}
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

export default Dashboard;