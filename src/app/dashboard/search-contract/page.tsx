"use client";
import React, { useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import ViewModal from "./ViewModal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Contract {
  id: number;
  batch: string;
  year: string;
  posting: string;
  preBid: string;
  bidding: string;
  contractID: string;
  projectName: string;
  status: string;
  contractAmount?: string;
  contractor?: string;
  bidEvalStart?: string;
  bidEvalEnd?: string;
  postQualStart?: string;
  postQualEnd?: string;
  reso?: string;
  noa?: string;
  ntp?: string;
  ntpRecieve?: string;
  contractDate?: string;
  lastUpdated: string;
}

const AdvancedSearch: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [contractor, setContractor] = useState<string>("");
  const [biddingDateStart, setBiddingDateStart] = useState<string>("");
  const [biddingDateEnd, setBiddingDateEnd] = useState<string>("");
  const [awardDateStart, setAwardDateStart] = useState<string>("");
  const [awardDateEnd, setAwardDateEnd] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const contractsPerPage = 10;

  // Add new state variables
  const [searchProjectName, setSearchProjectName] = useState<string>("");
  const [searchContractID, setSearchContractID] = useState<string>("");

  // Modify handleSearch function
  const handleSearch = async () => {
    try {
      const db = await Database.load("sqlite:tauri.db");
      let query = `SELECT * FROM contracts WHERE year = ?`;
      const params: string[] = [selectedYear];

      if (contractor) {
        query += ` AND contractor LIKE ?`;
        params.push(`%${contractor}%`);
      }

      if (searchProjectName) {
        query += ` AND projectName REGEXP ?`;
        params.push(searchProjectName);
      }

      if (searchContractID) {
        query += ` AND contractID REGEXP ?`;
        params.push(searchContractID);
      }

      if (biddingDateStart && biddingDateEnd) {
        query += ` AND bidding BETWEEN ? AND ?`;
        params.push(biddingDateStart, biddingDateEnd);
      }

      if (awardDateStart && awardDateEnd) {
        query += ` AND noa BETWEEN ? AND ?`;
        params.push(awardDateStart, awardDateEnd);
      }

      const result = await db.select<Contract[]>(query, params);
      setContracts(result);
      setCurrentPage(0);
    } catch (error) {
      toast.error("Search failed");
      console.error(error);
    }
  };
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(true);

  // Update handleReset
  const handleReset = () => {
    setContractor("");
    setBiddingDateStart("");
    setBiddingDateEnd("");
    setAwardDateStart("");
    setAwardDateEnd("");
    setSearchProjectName("");
    setSearchContractID("");
    setSelectedYear(new Date().getFullYear().toString());
  };

  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewModalOpen(true);
  };

  // Pagination
  const offset = currentPage * contractsPerPage;
  const currentContracts = contracts.slice(offset, offset + contractsPerPage);
  const pageCount = Math.ceil(contracts.length / contractsPerPage);

  return (
    <div className="p-10 bg-gray-50 min-h-screen w-full">
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          className="px-3 py-2 rounded-md text-xs font-bold w-max text-gray-700 bg-white transition-colors flex gap-2 shadow-sm"
        >
          {isFiltersVisible ? (
            <>
              <span>Hide Filters</span>
              <FaChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show Filters</span>
              <FaChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Search Filters */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isFiltersVisible
            ? "opacity-100 max-h-[2000px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-6">Search Filters</h2>

          {/* Basic Filters */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="select select-bordered select-sm w-full bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Project Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={searchProjectName}
                onChange={(e) => setSearchProjectName(e.target.value)}
                className="custom-input w-full"
                placeholder="Enter project name or pattern..."
              />
            </div>

            {/* Contract ID Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract ID
              </label>
              <input
                type="text"
                value={searchContractID}
                onChange={(e) => setSearchContractID(e.target.value)}
                className="custom-input w-full"
                placeholder="Enter contract ID or pattern..."
              />
            </div>
          </div>

          {/* Date Ranges */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Bidding Date Range */}
            <div className="border p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bidding Date Range
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={biddingDateStart}
                    onChange={(e) => setBiddingDateStart(e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={biddingDateEnd}
                    onChange={(e) => setBiddingDateEnd(e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* Award Date Range */}
            <div className="border p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Award Date Range
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={awardDateStart}
                    onChange={(e) => setAwardDateStart(e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={awardDateEnd}
                    onChange={(e) => setAwardDateEnd(e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contractor Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contractor
            </label>
            <input
              type="text"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              className="custom-input w-1/2"
              placeholder="Enter contractor name..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline rounded-none px-6"
            >
              Reset Filters
            </button>
            <button
              onClick={handleSearch}
              className="btn btn-sm btn-neutral rounded-none px-6"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-xs">
              <th className="p-3 text-left">Contract ID</th>
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3 text-left">Contractor</th>
              <th className="p-3 text-left">Bidding Date</th>
              <th className="p-3 text-left">Award Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {currentContracts.map((contract) => (
              <tr key={contract.id} className="border-t hover:bg-gray-50 text-zinc-600">
                <td className="p-3">{contract.contractID}</td>
                <td className="p-3">{contract.projectName}</td>
                <td className="p-3">{contract.contractor}</td>
                <td className="p-3">{contract.bidding}</td>
                <td className="p-3">{contract.noa}</td>
                <td className="p-3">{contract.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleView(contract)}
                    className="btn btn-xs btn-outline rounded-none"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={"flex justify-center space-x-2 mt-4"}
        pageClassName={"btn btn-xs"}
        activeClassName={"btn-active"}
        previousClassName={"btn btn-xs"}
        nextClassName={"btn btn-xs"}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
      />

      <ToastContainer />
    </div>
  );
};

export default AdvancedSearch;
