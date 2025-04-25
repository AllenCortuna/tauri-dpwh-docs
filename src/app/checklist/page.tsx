"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
import { FaCheck, FaPlus } from "react-icons/fa";
import { invoke } from "@tauri-apps/api/core";

interface Contract {
  id: number;
  contractID: string;
  projectName: string;
  status: string;
  year: string;
  hasMatchingFile?: boolean;
}

const Checklist: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [currentYear, setCurrentYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [filterCheck, setFilterCheck] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const selectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });
      if (selected && !Array.isArray(selected)) {
        setSelectedPath(selected);
        await checkFiles(selected);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      toast.error("Failed to select folder");
    }
  };

  const checkFiles = async (folderPath: string) => {
    try {
      setIsLoading(true);
      const entries = await readDir(folderPath);

      const updatedContracts = contracts.map((contract) => {
        const hasMatch = entries.some((entry) => {
          const path = entry.name.toLowerCase();
          const contractId = contract.contractID.toLowerCase();
          return path.includes(contractId);
        });
        return { ...contract, hasMatchingFile: hasMatch };
      });

      setContracts(updatedContracts);
      applyFilters(updatedContracts);
    } catch (error) {
      console.error("Error checking files:", error);
      toast.error("Failed to check files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        
        const result = await invoke('execute_mssql_query', {
          queryRequest: {
            query: "SELECT contractID, projectName, status, year FROM contracts WHERE year = @p1 ORDER BY contractID",
            params: [currentYear]
          }
        });

        const contractsList = (result as {rows: Contract[]}).rows;
        const contractsWithStatus = contractsList.map((contract) => ({
          ...contract,
          hasMatchingFile: false,
        }));
        
        setContracts(contractsWithStatus);
        applyFilters(contractsWithStatus);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Failed to fetch contracts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [currentYear]);

  const applyFilters = (contractsToFilter: Contract[]) => {
    let result = [...contractsToFilter];

    // Apply filter by status
    if (filterCheck === "present") {
      result = result.filter((contract) => contract.hasMatchingFile);
    } else if (filterCheck === "missing") {
      result = result.filter((contract) => !contract.hasMatchingFile);
    }
    // Apply filter by status
    if (filterStatus !== "all") {
      result = result.filter((contract) => contract.status === filterStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      const comparison = a.contractID.localeCompare(b.contractID);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredContracts(result);
  };

  useEffect(() => {
    applyFilters(contracts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCheck, filterStatus, sortDirection]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCheck(e.target.value);
  };
  const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value); 
  }

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(e.target.value);
  };

  // Generate year options (current year and 5 years back)
  const currentYearNum = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYearNum - i);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-700">Contract Checklist</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={selectFolder}
            className="px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
          >
            Select Folder
          </button>
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
      </div>

      {!isLoading && (
        <div className="flex justify-end items-center gap-4 mb-4">
          <button
            onClick={toggleSortDirection}
            className="flex items-center px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 bg-white hover:bg-primary hover:btn-outline transition-colors border tooltip-bottom tooltip"
            data-tip="Sort by contract ID"
          >
            Sort {sortDirection === "asc" ? "↑" : "↓"}
          </button>

          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-xs text-gray-700">
              Filter:
            </label>
            <select
              id="filterCheck"
              value={filterCheck}
              onChange={handleFilterChange}
              className="select select-sm text-xs text-zinc-700 input-bordered bg-white focus:outline-primary focus:border-zinc-100 w-32"
            >
              <option value="all">All</option>
              <option value="present">Check</option>
              <option value="missing">Missing</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-xs text-gray-700">
              Status:
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={handleFilterStatus}
              className="select select-sm text-xs text-zinc-700 input-bordered bg-white focus:outline-primary focus:border-zinc-100 w-32"
            >
              <option value="all">All</option>
              <option value="posted">Posted</option>
              <option value="award">Award</option>
              <option value="proceed">Proceed</option>
            </select>
          </div>

          {selectedPath && (
            <div className="px-3 py-2 rounded-md text-xs text-white bg-neutral btn-outline transition-colors w-max mb-4 ml-auto mr-4">
              {selectedPath.split("\\").pop()}
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 w-32 text-left text-xs font-bold text-neutral uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral uppercase tracking-wider">
                    Checklist
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-xs">
                {filteredContracts.length > 0 ? (
                  filteredContracts.map((contract) => (
                    <tr key={contract.contractID}>
                      <td className="px-6 py-4 text-primary font-bold tooltip-right tooltip" data-tip={contract.status}>
                        {contract.contractID}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {contract.projectName}
                      </td>
                      <td className="px-6 py-4 text-lg">
                        {contract.hasMatchingFile ? (
                          <span className="text-green-600">
                            <FaCheck />
                          </span>
                        ) : (
                          <span className="text-red-500">
                            <FaPlus className="rotate-45" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {contracts.length > 0
                        ? "No contracts match the current filter."
                        : `No contracts found for ${currentYear}.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Checklist;
