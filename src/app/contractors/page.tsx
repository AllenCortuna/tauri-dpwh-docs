"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUsers, FaUserTie, FaBuilding } from "react-icons/fa";
import { BsPersonVcard } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import ContractorNav from "../components/ContractorNav";
import { invoke } from '@tauri-apps/api/core';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  ChartOptions, 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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

// Define chart data type
interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
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

  // Fetch contractor statistics
  useEffect(() => {
    fetchContractorStats();
  }, []);

  const fetchContractorStats = async () => {
    try {
      setIsLoading(true);

      // Get total contractors count
      const totalContractorsResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT * FROM contractors"
        }
      });

      // Get contractors with email count
      const withEmailResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT * FROM contractors WHERE email IS NOT NULL AND email != ''"
        }
      });

      // Get contractors with TIN count
      const withTINResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT * FROM contractors WHERE tin IS NOT NULL AND tin != ''"
        }
      });

      // Get contractors with AMO count
      const withAMOResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT * FROM contractors WHERE amo IS NOT NULL AND amo != ''"
        }
      });

      // Get contractors with designation count
      const withDesignationResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT * FROM contractors WHERE designation IS NOT NULL AND designation != ''"
        }
      });

      // Get recent contractors
      const recentContractorsResult = await invoke('execute_mssql_query', {
        queryRequest: {
          query: "SELECT TOP 5 * FROM contractors ORDER BY lastUpdated DESC"
        }
      });
      console.log('recentContractorsResult', recentContractorsResult)
      

      setStats({
        totalContractors: (totalContractorsResult as {rows: Contractor[]}).rows.length || 0,
        totalWithEmail: (withEmailResult as {rows: Contractor[]}).rows.length || 0,
        totalWithTIN: (withTINResult as {rows: Contractor[]}).rows.length || 0,
        totalWithAMO: (withAMOResult as {rows: Contractor[]}).rows.length || 0,
        totalWithDesignation: (withDesignationResult as {rows: Contractor[]}).rows.length || 0,
      });

      setRecentContractors((recentContractorsResult as {rows: Contractor[]}).rows || 0);
    } catch (error) {
      console.error("Error fetching contractor stats:", error);
      toast.error("Failed to fetch contractor statistics");
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data preparation function
  const prepareChartData = (withValue: number, total: number): ChartData => {
    const withoutValue = total - withValue;
    return {
      labels: ['With', 'Without'],
      datasets: [
        {
          data: [withValue, withoutValue],
          backgroundColor: ['#10b981', '#f3f4f6'],
          borderColor: ['#10b981', '#e5e7eb'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options with proper typing
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // Calculate percentage helper
  const calculatePercentage = (value: number, total: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Stat card component to reduce repetition
  const StatCard = ({ 
    title, 
    value, 
    total, 
    color, 
    icon: Icon 
  }: { 
    title: string; 
    value: number; 
    total: number; 
    color: string; 
    icon: React.ElementType 
  }) => (
    <div className={`bg-white rounded-lg p-6 border-l-4 border-${color}-600`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-500 text-xs mb-2">{title}</h2>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-gray-700">{value}</p>
            {title !== "Total Contractors" && (
              <>
                <div className="h-10 w-10">
                  <Doughnut 
                    data={prepareChartData(value, total)} 
                    options={chartOptions} 
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {calculatePercentage(value, total)}%
                </p>
              </>
            )}
          </div>
        </div>
        <Icon className={`text-4xl text-${color}-600 opacity-70`} />
      </div>
    </div>
  );

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
            <StatCard 
              title="Total Contractors" 
              value={stats.totalContractors} 
              total={stats.totalContractors} 
              color="indigo" 
              icon={FaUsers} 
            />
            <StatCard 
              title="With Email" 
              value={stats.totalWithEmail} 
              total={stats.totalContractors} 
              color="emerald" 
              icon={MdEmail} 
            />
            <StatCard 
              title="With TIN" 
              value={stats.totalWithTIN} 
              total={stats.totalContractors} 
              color="amber" 
              icon={BsPersonVcard} 
            />
            <StatCard 
              title="With AMO" 
              value={stats.totalWithAMO} 
              total={stats.totalContractors} 
              color="fuchsia" 
              icon={FaUserTie} 
            />
            <StatCard 
              title="With Designation" 
              value={stats.totalWithDesignation} 
              total={stats.totalContractors} 
              color="rose" 
              icon={FaBuilding} 
            />
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
                    <tr key={contractor.contractorName}>
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
