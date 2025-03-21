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
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Contract | null>(null);

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

  // Handle edit button click
  const handleEdit = (contract: Contract) => {
    setEditFormData(contract);
    setIsEditModalOpen(true);
  };

  // Handle edit form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  // Handle update contract
  const handleUpdateContract = async () => {
    try {
      const db = await Database.load("sqlite:tauri.db");
      await db.execute(
        `UPDATE contracts SET 
        batch = ?,
        posting = ?,
        preBid = ?,
        bidding = ?,
        contractID = ?,
        projectName = ?,
        status = ?,
        contractAmount = ?,
        contractor = ?,
        bidEvalStart = ?,
        bidEvalEnd = ?,
        postQualStart = ?,
        postQualEnd = ?,
        reso = ?,
        noa = ?,
        ntp = ?,
        ntpRecieve = ?,
        contractDate = ?,
        lastUpdated = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          editFormData?.batch,
          editFormData?.posting,
          editFormData?.preBid,
          editFormData?.bidding,
          editFormData?.contractID,
          editFormData?.projectName,
          editFormData?.status,
          editFormData?.contractAmount,
          editFormData?.contractor,
          editFormData?.bidEvalStart,
          editFormData?.bidEvalEnd,
          editFormData?.postQualStart,
          editFormData?.postQualEnd,
          editFormData?.reso,
          editFormData?.noa,
          editFormData?.ntp,
          editFormData?.ntpRecieve,
          editFormData?.contractDate,
          editFormData?.id
        ]
      );
      
      toast.success("Contract updated successfully");
      setIsEditModalOpen(false);
      setEditFormData(null);
      fetchContracts(); // Refresh the contracts list
    } catch (error) {
      toast.error("Failed to update contract");
      console.error(error);
    }
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
                    onClick={() => handleEdit(contract)}
                    className="btn-outline text-warning rounded-none shadow-md btn-xs btn"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
          <div className="bg-white p-6 md:p-8 rounded-lg w-11/12 max-w-5xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Contract</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="block">
                  <span className="font-medium text-gray-700">Batch</span>
                  <input
                    type="text"
                    name="batch"
                    value={editFormData.batch}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Contract ID</span>
                  <input
                    type="text"
                    name="contractID"
                    value={editFormData.contractID}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Project Name</span>
                  <input
                    type="text"
                    name="projectName"
                    value={editFormData.projectName}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Dates Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="block">
                  <span className="font-medium text-gray-700">Posting Date</span>
                  <input
                    type="date"
                    name="posting"
                    value={editFormData.posting}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Pre-Bid Date</span>
                  <input
                    type="date"
                    name="preBid"
                    value={editFormData.preBid}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Bidding Date</span>
                  <input
                    type="date"
                    name="bidding"
                    value={editFormData.bidding}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Bid Evaluation Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="block">
                  <span className="font-medium text-gray-700">Bid Evaluation Date</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-gray-600">From:</span>
                      <input
                        type="date"
                        name="bidEvalStart"
                        value={editFormData.bidEvalStart || ""}
                        onChange={handleEditFormChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">To:</span>
                      <input
                        type="date"
                        name="bidEvalEnd"
                        value={editFormData.bidEvalEnd || ""}
                        onChange={handleEditFormChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Post Qualification Date</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-gray-600">From:</span>
                      <input
                        type="date"
                        name="postQualStart"
                        value={editFormData.postQualStart || ""}
                        onChange={handleEditFormChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">To:</span>
                      <input
                        type="date"
                        name="postQualEnd"
                        value={editFormData.postQualEnd || ""}
                        onChange={handleEditFormChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="block">
                  <span className="font-medium text-gray-700">Resolution</span>
                  <input
                    type="date"
                    name="reso"
                    value={editFormData.reso || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Notice of Award</span>
                  <input
                    type="date"
                    name="noa"
                    value={editFormData.noa || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Notice to Proceed</span>
                  <input
                    type="date"
                    name="ntp"
                    value={editFormData.ntp || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">NTP Receive Date</span>
                  <input
                    type="date"
                    name="ntpRecieve"
                    value={editFormData.ntpRecieve || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Contract Date</span>
                  <input
                    type="date"
                    name="contractDate"
                    value={editFormData.contractDate || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Contract Amount</span>
                  <input
                    type="text"
                    name="contractAmount"
                    value={editFormData.contractAmount || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Contractor</span>
                  <input
                    type="text"
                    name="contractor"
                    value={editFormData.contractor || ""}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="block">
                  <span className="font-medium text-gray-700">Status</span>
                  <input
                    type="text"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditFormData(null);
                }}
                className="btn-outline text-gray-700 rounded-none shadow-md btn btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContract}
                className="btn btn-neutral rounded-none shadow-md text-white btn-sm"
              >
                Save Changes
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