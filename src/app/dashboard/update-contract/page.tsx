// SearchContracts.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import EditModal from "./EditModal";
import { invoke } from '@tauri-apps/api/core';

interface Contract {
  id: number;
  batch: string;
  year: string; // Added year field
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
  // Add new state for year filter
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "batch" | "year" | "contractID" | "bidding" | "projectName" | "contractor"
  >("batch");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Contract | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const contractsPerPage = 10;

  // Fetch all contracts from the database
  // Modify fetchContracts to include year filter
  const fetchContracts = async () => {
    try {
      const result :{rows: Contract[]} = await invoke("execute_mssql_query", {
        queryRequest: {
          query:  `SELECT * FROM contracts WHERE year = ${selectedYear}`
        }
      });
      setContracts(result.rows);
    } catch (error) {
      toast.error("Failed to fetch contracts.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContracts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  // Modify handleSearch to include year filter
  const handleSearch = async () => {
    try {
      let query = `SELECT * FROM contracts WHERE year = ${selectedYear} AND `;
      const params: string[] = [selectedYear];

      switch (searchType) {
        case "batch":
          query += `batch LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        case "year":
          query += `year LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        case "contractID":
          query += `contractID LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        case "bidding":
          query += `bidding LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        case "projectName":
          query += `projectName LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        case "contractor":
          query += `contractor LIKE ${searchQuery}`;
          params.push(`%${searchQuery}%`);
          break;
        default:
          query += `1=1`;
      }
      const result :{rows: Contract[]} = await invoke("execute_mssql_query", {
        queryRequest: {
          query
        }
      });

      setContracts(result.rows);
      setCurrentPage(0); // Reset to first page after search
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
      // Determine status based on noa and ntp
      let status = "posted";
      if (editFormData?.noa) {
        status = "awarded";
      }
      if (editFormData?.ntp) {
        status = "proceed";
      } 

      const query = `UPDATE contracts SET 
        batch = @p1,
        year = @p2,
        posting = @p3,
        preBid = @p4,
        bidding = @p5,
        contractID = @p6,
        projectName = @p7,
        status = @p8,
        contractAmount = @p9,
        contractor = @p10,
        bidEvalStart = @p11,
        bidEvalEnd = @p12,
        postQualStart = @p13,
        postQualEnd = @p14,
        reso = @p15,
        noa = @p16,
        ntp = @p17,
        ntpRecieve = @p18,
        contractDate = @p19,
        lastUpdated = GETDATE()
        WHERE id = @p20`;

      await invoke("execute_mssql_query", {
        queryRequest: { 
          query,
          params: [
            editFormData?.batch || '',
            editFormData?.year || '',
            editFormData?.posting || '',
            editFormData?.preBid || '',
            editFormData?.bidding || '',
            editFormData?.contractID || '',
            editFormData?.projectName || '',
            status,
            editFormData?.contractAmount || '',
            editFormData?.contractor || '',
            editFormData?.bidEvalStart || '',
            editFormData?.bidEvalEnd || '',
            editFormData?.postQualStart || '',
            editFormData?.postQualEnd || '',
            editFormData?.reso || '',
            editFormData?.noa || '',
            editFormData?.ntp || '',
            editFormData?.ntpRecieve || '',
            editFormData?.contractDate || '',
            editFormData?.id?.toString() || ''
          ]
        }
      });
      
      toast.success("Contract updated successfully");
      setIsEditModalOpen(false);
      setEditFormData(null);
      fetchContracts();
    } catch (error) {
      toast.error("Failed to update contract");
      console.error(error);
    }
  };

  // Pagination logic
  const offset = currentPage * contractsPerPage;
  const currentContracts = contracts.slice(offset, offset + contractsPerPage);
  const pageCount = Math.ceil(contracts.length / contractsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen w-full">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Search Contracts</h1>

      {/* Existing Search Bar */}
      <div className="flex gap-4 mb-8">
      <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setCurrentPage(0);
          }}
          className="select select-bordered select-sm bg-white"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(
              e.target.value as "batch" | "year" | "contractID" | "bidding" | "projectName" | "contractor"
            )
          }
          className="select select-bordered select-sm bg-white"
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
              <th className="p-3 text-left font-semibold text-gray-700">Year</th>
              <th className="p-3 text-left font-semibold text-gray-700">Contract ID</th>
              <th className="p-3 text-left font-semibold text-gray-700">Project Name</th>
              <th className="p-3 text-left font-semibold text-gray-700">Contractor</th>
              <th className="p-3 text-left font-semibold text-gray-700">Bidding</th>
              <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContracts.map((contract) => (
              <tr
                key={contract.contractID}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-700">{contract.batch}</td>
                <td className="p-3 text-gray-700">{contract.year}</td>
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

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center space-x-2 mt-4"}
        pageClassName={"btn btn-xs"}
        activeClassName={"btn-active"}
        previousClassName={"btn btn-xs"}
        nextClassName={"btn btn-xs"}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditFormData(null);
        }}
        editFormData={editFormData}
        onFormChange={handleEditFormChange}
        onSave={handleUpdateContract}
      />

      <ToastContainer />
    </div>
  );
};

export default SearchContracts;