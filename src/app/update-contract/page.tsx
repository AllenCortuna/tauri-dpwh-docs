"use client";
import React, { useState, useEffect} from "react";
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
      const db = await Database.load("sqlite:contract.db");
      const result = await db.select<Contract[]>("SELECT * FROM contract");
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
      const db = await Database.load("sqlite:contract.db");
      let query = "SELECT * FROM contract WHERE ";
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
      const db = await Database.load("sqlite:contract.db");
      await db.execute(
        `UPDATE contract SET
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
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Update Contracts</h1>

      {/* Search Bar */}
      <div className="flex gap-4 mb-5">
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(
              e.target.value as "batch" | "contractID" | "bidding" | "projectName" | "contractor"
            )
          }
          className="p-2 border rounded"
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
          className="p-2 border rounded flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Contracts Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Batch</th>
            <th className="p-2 border">Contract ID</th>
            <th className="p-2 border">Project Name</th>
            <th className="p-2 border">Contractor</th>
            <th className="p-2 border">Bidding</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-gray-100">
              <td className="p-2 border">{contract.batch}</td>
              <td className="p-2 border">{contract.contractID}</td>
              <td className="p-2 border">{contract.projectName}</td>
              <td className="p-2 border">{contract.contractor}</td>
              <td className="p-2 border">{contract.bidding}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(contract)}
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-5">Edit Contract</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(selectedContract);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Batch */}
                <label>
                  Batch:
                  <input
                    type="text"
                    value={selectedContract.batch}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        batch: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Posting Date */}
                <label>
                  Posting Date:
                  <input
                    type="date"
                    value={selectedContract.posting}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        posting: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Pre-Bid Date */}
                <label>
                  Pre-Bid Date:
                  <input
                    type="date"
                    value={selectedContract.preBid}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        preBid: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Bidding Date */}
                <label>
                  Bidding Date:
                  <input
                    type="date"
                    value={selectedContract.bidding}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidding: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Contract ID */}
                <label>
                  Contract ID:
                  <input
                    type="text"
                    value={selectedContract.contractID}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractID: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Project Name */}
                <label>
                  Project Name:
                  <input
                    type="text"
                    value={selectedContract.projectName}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        projectName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Status */}
                <label>
                  Status:
                  <input
                    type="text"
                    value={selectedContract.status}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Contract Amount */}
                <label>
                  Contract Amount:
                  <input
                    type="text"
                    value={selectedContract.contractAmount || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractAmount: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Contractor */}
                <label>
                  Contractor:
                  <input
                    type="text"
                    value={selectedContract.contractor || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractor: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Bid Evaluation Start */}
                <label>
                  Bid Evaluation Start:
                  <input
                    type="date"
                    value={selectedContract.bidEvalStart || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidEvalStart: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Bid Evaluation End */}
                <label>
                  Bid Evaluation End:
                  <input
                    type="date"
                    value={selectedContract.bidEvalEnd || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        bidEvalEnd: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Post-Qualification Start */}
                <label>
                  Post-Qualification Start:
                  <input
                    type="date"
                    value={selectedContract.postQualStart || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        postQualStart: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Post-Qualification End */}
                <label>
                  Post-Qualification End:
                  <input
                    type="date"
                    value={selectedContract.postQualEnd || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        postQualEnd: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Resolution */}
                <label>
                  Resolution:
                  <input
                    type="text"
                    value={selectedContract.reso || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        reso: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Notice of Award */}
                <label>
                  Notice of Award:
                  <input
                    type="text"
                    value={selectedContract.noa || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        noa: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Notice to Proceed */}
                <label>
                  Notice to Proceed:
                  <input
                    type="text"
                    value={selectedContract.ntp || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        ntp: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* NTP Receive Date */}
                <label>
                  NTP Receive Date:
                  <input
                    type="date"
                    value={selectedContract.ntpRecieve || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        ntpRecieve: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>

                {/* Contract Date */}
                <label>
                  Contract Date:
                  <input
                    type="date"
                    value={selectedContract.contractDate || ""}
                    onChange={(e) =>
                      setSelectedContract({
                        ...selectedContract,
                        contractDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end mt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
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