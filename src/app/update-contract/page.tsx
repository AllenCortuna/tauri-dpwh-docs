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

const UpdateContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"batch" | "contractID" | "bidding" | "projectName" | "contractor">("batch");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch all contracts from the database
  const fetchContracts = async () => {
    try {
      const db = await Database.load("mysql://admin:admin123@localhost:8889/tauri");
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
      const db = await Database.load("mysql://admin:admin123@localhost:8889/tauri");
      let query = "SELECT * FROM contracts WHERE ";
      switch (searchType) {
        case "batch":
          query += `batch LIKE '%${searchQuery}%'`;
          break;
        case "contractID":
          query += `contractID LIKE '%${searchQuery}%'`;
          break;
        case "bidding":
          query += `bidding LIKE '%${searchQuery}%'`;
          break;
        case "projectName":
          query += `projectName LIKE '%${searchQuery}%'`;
          break;
        case "contractor":
          query += `contractor LIKE '%${searchQuery}%'`;
          break;
        default:
          query += `1=1`;
      }
      const result = await db.select<Contract[]>(query);
      setContracts(result);
    } catch (error) {
      toast.error("Failed to search contracts.");
      console.error(error);
    }
  };

  // Handle edit button click
  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  // Handle form submission to update contract
  const handleUpdate = async (updatedContract: Contract) => {
    try {
      const db = await Database.load("mysql://admin:admin123@localhost:8889/tauri");
      await db.execute(
        `UPDATE contracts SET
          batch = $1, posting = $2, preBid = $3, bidding = $4,
          contractID = $5, projectName = $6, status = $7,
          contractAmount = $8, contractor = $9, bidEvalStart = $10,
          bidEvalEnd = $11, postQualStart = $12, postQualEnd = $13,
          reso = $14, noa = $15, ntp = $16, ntpRecieve = $17,
          contractDate = $18, lastUpdated = $19
        WHERE id = $20`,
        [
          updatedContract.batch,
          updatedContract.posting,
          updatedContract.preBid,
          updatedContract.bidding,
          updatedContract.contractID,
          updatedContract.projectName,
          updatedContract.status,
          updatedContract.contractAmount || null,
          updatedContract.contractor || null,
          updatedContract.bidEvalStart || null,
          updatedContract.bidEvalEnd || null,
          updatedContract.postQualStart || null,
          updatedContract.postQualEnd || null,
          updatedContract.reso || null,
          updatedContract.noa || null,
          updatedContract.ntp || null,
          updatedContract.ntpRecieve || null,
          updatedContract.contractDate || null,
          new Date().toISOString(),
          updatedContract.id,
        ]
      );
      toast.success("Contract updated successfully!");
      fetchContracts(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to update contract.");
      console.error(error);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen w-full">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Update Contracts</h1>

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
              <tr key={contract.id} className="border-t hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-700">{contract.batch}</td>
                <td className="p-3 text-gray-700">{contract.contractID}</td>
                <td className="p-3 text-gray-700">{contract.projectName}</td>
                <td className="p-3 text-gray-700">{contract.contractor}</td>
                <td className="p-3 text-gray-700">{contract.bidding}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(contract)}
                    className="btn-outline text-primary rounded-none shadow-md btn-xs btn"
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
      {isModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-4xl shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Contract</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(selectedContract);
              }}
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Batch */}
                <label className="block">
                  <span className="font-medium text-gray-700">Batch</span>
                  <input
                    type="text"
                    value={selectedContract.batch}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        batch: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Posting Date */}
                <label className="block">
                  <span className="font-medium text-gray-700">Posting Date</span>
                  <input
                    type="date"
                    value={selectedContract.posting}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        posting: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Pre-Bid Date */}
                <label className="block">
                  <span className="font-medium text-gray-700">Pre-Bid Date</span>
                  <input
                    type="date"
                    value={selectedContract.preBid}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        preBid: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Bidding Date */}
                <label className="block">
                  <span className="font-medium text-gray-700">Bidding Date</span>
                  <input
                    type="date"
                    value={selectedContract.bidding}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidding: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Contract ID */}
                <label className="block">
                  <span className="font-medium text-gray-700">Contract ID</span>
                  <input
                    type="text"
                    value={selectedContract.contractID}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractID: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Project Name */}
                <label className="block">
                  <span className="font-medium text-gray-700">Project Name</span>
                  <input
                    type="text"
                    value={selectedContract.projectName}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        projectName: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Status */}
                <label className="block">
                  <span className="font-medium text-gray-700">Status</span>
                  <input
                    type="text"
                    value={selectedContract.status}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        status: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Contract Amount */}
                <label className="block">
                  <span className="font-medium text-gray-700">Contract Amount</span>
                  <input
                    type="text"
                    value={selectedContract.contractAmount || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractAmount: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Contractor */}
                <label className="block">
                  <span className="font-medium text-gray-700">Contractor</span>
                  <input
                    type="text"
                    value={selectedContract.contractor || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractor: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Bid Evaluation Start */}
                <label className="block">
                  <span className="font-medium text-gray-700">Bid Evaluation Start</span>
                  <input
                    type="date"
                    value={selectedContract.bidEvalStart || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidEvalStart: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Bid Evaluation End */}
                <label className="block">
                  <span className="font-medium text-gray-700">Bid Evaluation End</span>
                  <input
                    type="date"
                    value={selectedContract.bidEvalEnd || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidEvalEnd: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Post-Qualification Start */}
                <label className="block">
                  <span className="font-medium text-gray-700">Post-Qualification Start</span>
                  <input
                    type="date"
                    value={selectedContract.postQualStart || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        postQualStart: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Post-Qualification End */}
                <label className="block">
                  <span className="font-medium text-gray-700">Post-Qualification End</span>
                  <input
                    type="date"
                    value={selectedContract.postQualEnd || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        postQualEnd: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Resolution */}
                <label className="block">
                  <span className="font-medium text-gray-700">Resolution</span>
                  <input
                    type="text"
                    value={selectedContract.reso || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        reso: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Notice of Award */}
                <label className="block">
                  <span className="font-medium text-gray-700">Notice of Award</span>
                  <input
                    type="text"
                    value={selectedContract.noa || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        noa: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Notice to Proceed */}
                <label className="block">
                  <span className="font-medium text-gray-700">Notice to Proceed</span>
                  <input
                    type="text"
                    value={selectedContract.ntp || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        ntp: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* NTP Receive Date */}
                <label className="block">
                  <span className="font-medium text-gray-700">NTP Receive Date</span>
                  <input
                    type="date"
                    value={selectedContract.ntpRecieve || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        ntpRecieve: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Contract Date */}
                <label className="block">
                  <span className="font-medium text-gray-700">Contract Date</span>
                  <input
                    type="date"
                    value={selectedContract.contractDate || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractDate: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white p-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-200 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UpdateContracts;