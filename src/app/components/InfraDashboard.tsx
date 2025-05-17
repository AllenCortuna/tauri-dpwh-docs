"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavLinks from "../components/ContractNav";
import { error } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';
import { Contractor } from "../../../config/interface";
import useSelectDatabase from "../../../config/useSelectDatabase";

interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  contractor?: string;
  status: string;
  bidding: string;
  ntp?: string;
  noa?: string;
  year: string;
}

interface DashboardStats {
  totalContracts: number;
  totalContractors: number;
  totalAwardedCurrentYear: number;
  totalPostedCurrentYear: number;
  totalProceedCurrentYear: number;
  totalCancelledCurrentYear: number;
}

const InfraDashboard: React.FC = () => {
  const { databaseType } = useSelectDatabase();
  const tableName = databaseType === 'goods' ? 'goods' : 'contracts';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalContracts: 0,
    totalContractors: 0,
    totalAwardedCurrentYear: 0,
    totalPostedCurrentYear: 0,
    totalProceedCurrentYear: 0,
    totalCancelledCurrentYear: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentYear, setCurrentYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [postedContracts, setPostedContracts] = useState<Contract[]>([]);
  const [awardedContracts, setAwardedContracts] = useState<Contract[]>([]);
  const [proceedContracts, setProceedContracts] = useState<Contract[]>([]);
  const [cancelledContracts, setCancelledContracts] = useState<Contract[]>([]);
  const [activeTab, setActiveTab] = useState<"posted" | "awarded" | "proceed" | "cancelled">(
    "posted"
  );

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);

        // Get total contracts
        const totalContractsResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE year = '${currentYear}'`
          }
        });
        console.log('totalContractsResponse', totalContractsResponse)

        // Get total contractors
        const totalContractorsResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: "SELECT * FROM contractors"
          }
        });

        // Get awarded contracts for current year
        const awardedResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE status = 'awarded' AND year = '${currentYear}'`
          }
        });

        // Get posted contracts for current year
        const postedResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE status = 'posted' AND year = '${currentYear}'`
          }
        });

        // Get proceed contracts for current year
        const proceedResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE status = 'proceed' AND year = '${currentYear}'`
          }
        });

        const cancelledResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT * FROM ${tableName} WHERE status = 'cancelled' AND year = '${currentYear}'`
          }
        });

        // Fetch contract lists
        const postedListResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT id, contractID, projectName, contractor, status, bidding 
                 FROM ${tableName} 
                 WHERE status = 'posted' AND year = '${currentYear}' 
                 ORDER BY bidding DESC`
          }
        });

        const awardedListResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT id, contractID, projectName, contractor, status, bidding, noa 
                 FROM ${tableName} 
                 WHERE status = 'awarded' AND year = '${currentYear}' 
                 ORDER BY noa DESC`
          }
        });

        const proceedListResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT id, contractID, projectName, contractor, status, bidding, ntp 
                 FROM ${tableName} 
                 WHERE status = 'proceed' AND year = '${currentYear}' 
                 ORDER BY ntp DESC`
          }
        });

        const cancelledListResponse = await invoke("execute_mssql_query", {
          queryRequest: {
            query: `SELECT id, contractID, projectName, contractor, status, bidding, ntp 
                 FROM ${tableName} 
                 WHERE status = 'cancelled' AND year = '${currentYear}' 
                 ORDER BY ntp DESC`
          }
        });

        setStats({
          totalContracts: (totalContractsResponse as { rows: Contract[] }).rows.length || 0,
          totalContractors: (totalContractorsResponse as { rows: { count: Contractor }[] }).rows.length || 0,
          totalAwardedCurrentYear: (awardedResponse as { rows: Contract[] }).rows.length || 0,
          totalPostedCurrentYear: (postedResponse as { rows: Contract[] }).rows.length || 0,
          totalProceedCurrentYear: (proceedResponse as { rows: Contract[] }).rows.length || 0,
          totalCancelledCurrentYear: (cancelledResponse as { rows: Contract[] }).rows.length || 0,
        });

        // Fix the duplicate key issue by ensuring each contract has a unique key
        // Add index to the contract ID if it's null
        setPostedContracts(((postedListResponse as { rows: Contract[] }).rows || []).map((contract, index) => ({
          ...contract,
          id: contract.id || index + 1000 // Use index as fallback ID if contract.id is null
        })));

        setAwardedContracts(((awardedListResponse as { rows: Contract[] }).rows || []).map((contract, index) => ({
          ...contract,
          id: contract.id || index + 2000 // Use index as fallback ID if contract.id is null
        })));

        setProceedContracts(((proceedListResponse as { rows: Contract[] }).rows || []).map((contract, index) => ({
          ...contract,
          id: contract.id || index + 3000 // Use index as fallback ID if contract.id is null
        })));

        setCancelledContracts(((cancelledListResponse as { rows: Contract[] }).rows || []).map((contract, index) => ({
          ...contract,
          id: contract.id || index + 3000 // Use index as fallback ID if contract.id is null
        })));


      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error("Error fetching dashboard stats:", err);
        // Log error to Tauri's logging system
        await error(`Dashboard Stats Fetch Error: ${errorMessage}`);
        // Log additional context if available
        if (err instanceof Error && err.stack) {
          await error(`Error Stack: ${err.stack}`);
        }
        toast.error("Failed to fetch dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [currentYear, tableName, databaseType]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(e.target.value);
  };

  // Generate year options (current year and 5 years back)
  const currentYearNum = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYearNum - i);

  // Get the appropriate title based on database type
  const dashboardTitle = databaseType === 'goods' ? 'Goods and Services' : 'Civil Works';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 md:gap-x-20 gap-x-10">
        {/* Replaced with NavLinks component */}
        <NavLinks />
        <h1 className="text-2xl font-bold text-gray-700">{dashboardTitle}</h1>
        <div className="flex items-center">
          <label htmlFor="year" className="mr-2 text-gray-700">
            Year:
          </label>
          <select
            id="year"
            value={currentYear}
            onChange={handleYearChange}
            className="select select-sm text-xs text-zinc-700 input-bordered bg-white focus:outline-primary focus:border-zinc-100 w-24"
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
        <div className="flex justify-center w-full items-center h-64">
          <div className="loading loading-dots loading-xl"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Contracts Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h2 className="text-gray-500 text-sm mb-2">
                Total {databaseType === 'goods' ? 'Goods' : 'Contracts'}
              </h2>
              <p className="text-[2rem] font-bold text-gray-700">
                {stats.totalContracts}
              </p>
            </div>

            {/* Total Contractors Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h2 className="text-gray-500 text-sm mb-2">
                Total {databaseType === 'goods' ? 'Suppliers' : 'Contractors'}
              </h2>
              <p className="text-[2rem] font-bold text-gray-700">
                {stats.totalContractors}
              </p>
            </div>

            {/* Current Year Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 md:col-span-2 lg:col-span-1">
              <h2 className="text-gray-500 font-semibold text-sm mb-4">
                {currentYear} {databaseType === 'goods' ? 'Goods' : 'Contract'} Status
              </h2>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Posted</span>
                  <span className="font-extrabold text-gray-600 text-sm">
                    {stats.totalPostedCurrentYear}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Awarded</span>
                  <span className="font-extrabold text-gray-600 text-sm">
                    {stats.totalAwardedCurrentYear}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Proceed</span>
                  <span className="font-extrabold text-gray-600 text-sm">
                    {stats.totalProceedCurrentYear}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Cancelled/Rebid</span>
                  <span className="font-extrabold text-gray-600 text-sm">
                    {stats.totalCancelledCurrentYear}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-medium text-xs text-gray-600">
                    Total for {currentYear}
                  </span>
                  <span className="font-bold text-gray-600">
                    {stats.totalPostedCurrentYear +
                      stats.totalAwardedCurrentYear +
                      stats.totalProceedCurrentYear +
                      stats.totalCancelledCurrentYear 
                      }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Lists Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 ${
                  activeTab === "posted"
                    ? "text-orange-600 border-b-2 border-orange-600 font-bold"
                    : "text-xs text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("posted")}
              >
                Posted
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "awarded"
                    ? "text-orange-600 border-b-2 border-orange-600 font-bold"
                    : "text-xs text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("awarded")}
              >
                Awarded
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "proceed"
                    ? "text-orange-600 border-b-2 border-orange-600 font-bold"
                    : "text-xs text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("proceed")}
              >
                With NTP
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "cancelled"
                    ? "text-orange-600 border-b-2 border-orange-600 font-bold"
                    : "text-xs text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("cancelled")}
              >
                Cancelled
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                  {(() => {
                    const renderContract = (contract: Contract) => (
                      <tr key={contract.id}>
                        <td className="px-6 py-4 text-primary font-bold">
                          {contract.contractID}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {contract.projectName}
                        </td>
                        {activeTab === "awarded" && (
                          <>
                            <td className="px-6 py-4 text-gray-500">
                              {contract.contractor || ""}
                            </td>
                            <td className="px-6 py-4 w-36 text-gray-500">
                              {contract.noa || ""}
                            </td>
                          </>
                        )}
                        {activeTab === "proceed" && (
                          <td className="px-6 py-4 w-36 text-gray-500">
                            {contract.ntp || ""}
                          </td>
                        )}
                      </tr>
                    );

                    const contractMap = {
                      posted: postedContracts,
                      awarded: awardedContracts,
                      proceed: proceedContracts,
                      cancelled: cancelledContracts
                    };

                    const contracts = contractMap[activeTab];

                    return contracts.length > 0 ? (
                      contracts.map(renderContract)
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No contracts found for this status.
                        </td>
                      </tr>
                    );
                  })()}
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

export default InfraDashboard;
