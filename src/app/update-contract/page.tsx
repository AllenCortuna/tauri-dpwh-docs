"use client";
import React, { useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Contract {
  id: number;
  batch: string;
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

const SearchContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "batch" | "contractID" | "bidding" | "projectName" | "contractor"
  >("batch");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Fetch all contracts from the database
  const fetchContracts = async () => {
    try {
      // Changed from MySQL to SQLite connection
      const db = await Database.load("sqlite:tauri.db");
      const result = await db.select<Contract[]>("SELECT * FROM contracts LIMIT 100");
      setContracts(result);
    } catch (error) {
      toast.error("Failed to fetch contracts.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle search
  const handleSearch = async () => {
    try {
      // Changed from MySQL to SQLite connection
      const db = await Database.load("sqlite:tauri.db");
      let query = "SELECT * FROM contracts WHERE ";
      const params: string[] = [];

      switch (searchType) {
        case "batch":
          query += `batch LIKE ?`;
          params.push(`%${searchQuery}%`);
          break;
        case "contractID":
          query += `contractID LIKE ?`;
          params.push(`%${searchQuery}%`);
          break;
        case "bidding":
          query += `bidding LIKE ?`;
          params.push(`%${searchQuery}%`);
          break;
        case "projectName":
          query += `projectName LIKE ?`;
          params.push(`%${searchQuery}%`);
          break;
        case "contractor":
          query += `contractor LIKE ?`;
          params.push(`%${searchQuery}%`);
          break;
        default:
          query += `1=1`;
      }

      const result = await db.select<Contract[]>(query, params);
      setContracts(result);
    } catch (error) {
      toast.error("Failed to search contracts.");
      console.error(error);
    }
  };

  // Handle view button click
  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen w-full">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Search Contracts</h1>

      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(
              e.target.value as "batch" | "contractID" | "bidding" | "projectName" | "contractor"
            )
          }
          className="custom-input w-52"
        >
          <option value="batch">Batch</option>
          <option value="contractID">Contract ID</option>
          <option value="bidding">Bidding</option>
          <option value="projectName">Project Name</option>
          <option value="contractor">Contractor</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="custom-input w-80"
        />
        <button
          onClick={handleSearch}
          className="btn btn-sm btn-neutral rounded-none text-white"
        >
          Search
        </button>
      </div>

      {/* Contracts Table */}
      <div className="overflow-x-auto text-xs bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Batch</th>
              <th className="p-3 text-left font-semibold text-gray-700">Contract ID</th>
              <th className="p-3 text-left font-semibold text-gray-700">Project Name</th>
              <th className="p-3 text-left font-semibold text-gray-700">Contractor</th>
              <th className="p-3 text-left font-semibold text-gray-700">Bidding</th>
              <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-700">{contract.batch}</td>
                <td className="p-3 text-gray-700">{contract.contractID}</td>
                <td className="p-3 text-gray-700">{contract.projectName}</td>
                <td className="p-3 text-gray-700">{contract.contractor}</td>
                <td className="p-3 text-gray-700">{contract.bidding}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleView(contract)}
                    className="btn-outline text-primary rounded-none shadow-md btn-xs btn"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-4xl shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">View Contract</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Batch */}
              <div className="block">
                <span className="font-medium text-gray-700">Batch</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.batch}
                </p>
              </div>

              {/* Posting Date */}
              <div className="block">
                <span className="font-medium text-gray-700">Posting Date</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.posting}
                </p>
              </div>

              {/* Pre-Bid Date */}
              <div className="block">
                <span className="font-medium text-gray-700">Pre-Bid Date</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.preBid}
                </p>
              </div>

              {/* Bidding Date */}
              <div className="block">
                <span className="font-medium text-gray-700">Bidding Date</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.bidding}
                </p>
              </div>

              {/* Contract ID */}
              <div className="block">
                <span className="font-medium text-gray-700">Contract ID</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.contractID}
                </p>
              </div>

              {/* Project Name */}
              <div className="block">
                <span className="font-medium text-gray-700">Project Name</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.projectName}
                </p>
              </div>

              {/* Status */}
              <div className="block">
                <span className="font-medium text-gray-700">Status</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.status}
                </p>
              </div>

              {/* Contract Amount */}
              <div className="block">
                <span className="font-medium text-gray-700">Contract Amount</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.contractAmount || "N/A"}
                </p>
              </div>

              {/* Contractor */}
              <div className="block">
                <span className="font-medium text-gray-700">Contractor</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.contractor || "N/A"}
                </p>
              </div>

              {/* Bid Evaluation Start */}
              <div className="block">
                <span className="font-medium text-gray-700">Bid Evaluation Start</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.bidEvalStart || "N/A"}
                </p>
              </div>

              {/* Bid Evaluation End */}
              <div className="block">
                <span className="font-medium text-gray-700">Bid Evaluation End</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.bidEvalEnd || "N/A"}
                </p>
              </div>

              {/* Post-Qualification Start */}
              <div className="block">
                <span className="font-medium text-gray-700">Post-Qualification Start</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.postQualStart || "N/A"}
                </p>
              </div>

              {/* Post-Qualification End */}
              <div className="block">
                <span className="font-medium text-gray-700">Post-Qualification End</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.postQualEnd || "N/A"}
                </p>
              </div>

              {/* Resolution */}
              <div className="block">
                <span className="font-medium text-gray-700">Resolution</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.reso || "N/A"}
                </p>
              </div>

              {/* Notice of Award */}
              <div className="block">
                <span className="font-medium text-gray-700">Notice of Award</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.noa || "N/A"}
                </p>
              </div>

              {/* Notice to Proceed */}
              <div className="block">
                <span className="font-medium text-gray-700">Notice to Proceed</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.ntp || "N/A"}
                </p>
              </div>

              {/* NTP Receive Date */}
              <div className="block">
                <span className="font-medium text-gray-700">NTP Receive Date</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.ntpRecieve || "N/A"}
                </p>
              </div>

              {/* Contract Date */}
              <div className="block">
                <span className="font-medium text-gray-700">Contract Date</span>
                <p className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-50">
                  {selectedContract.contractDate || "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-500 text-white p-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SearchContracts;