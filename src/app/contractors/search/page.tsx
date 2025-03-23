"use client";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Database from "@tauri-apps/plugin-sql";
import { confirm } from '@tauri-apps/plugin-dialog';

interface Mailing {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  tin: string;
  address: string;
  lastUpdated: string;
}

const SearchMailings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("contractorName");
  const [mailings, setMailings] = useState<Mailing[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMailing, setSelectedMailing] = useState<Mailing | null>(null);
  const itemsPerPage = 10;

  // Initialize database on component mount
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await Database.load("sqlite:tauri.db");
        console.log("Database connected successfully");
      } catch (error) {
        console.error("Database connection error:", error);
      }
    };
    
    initializeDatabase();
  }, []);

  const handleSearch = async () => {
    try {
      const db = await Database.load("sqlite:tauri.db");
      
      // Build the SQL query based on the search field and term
      const query = `SELECT * FROM contractors WHERE ${searchField} LIKE ?`;
      const searchPattern = `%${searchTerm}%`;
      
      // Execute the query
      const result = await db.select<Mailing[]>(query, [searchPattern]);
      
      // Update state with results
      setMailings(result);
      setTotalPages(Math.ceil(result.length / itemsPerPage));
      setCurrentPage(0);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleUpdateMailing = async () => {
    if (!selectedMailing) return;

    try {
      const db = await Database.load("sqlite:tauri.db");
      
      // Update the contractor in the database
      await db.execute(
        `UPDATE contractors SET 
          contractorName = ?, 
          email = ?, 
          amo = ?, 
          tin = ?, 
          address = ?, 
          lastUpdated = ?
        WHERE id = ?`,
        [
          selectedMailing.contractorName,
          selectedMailing.email,
          selectedMailing.amo,
          selectedMailing.tin,
          selectedMailing.address,
          new Date().toISOString(),
          selectedMailing.id
        ]
      );

      // Refresh search results
      handleSearch();

      // Close modal
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteMailing = async (id: number) => {
    // Get the contractor name for the confirmation message
    const contractor = mailings.find(m => m.id === id);
    if (!contractor) return;

    // Show confirmation dialog
    const confirmation = await confirm(
      `This action cannot be reverted. Are you sure you want to delete ${contractor.contractorName}?`,
      { title: 'Tauri', kind: 'warning' }
    );

    if (!confirmation) return;

    try {
      const db = await Database.load("sqlite:tauri.db");
      
      // Delete the contractor from the database
      await db.execute(
        `DELETE FROM contractors WHERE id = ?`,
        [id]
      );

      // Refresh search results
      handleSearch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const displayedMailings = mailings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-4 gap-2">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="select text-sm select-bordered w-1/8"
        >
          <option value="contractorName">Contractor Name</option>
          <option value="email">Email</option>
          <option value="amo">Representative</option>
        </select>
        <input
          type="text"
          value={searchField == "contractorName" ? searchTerm.toUpperCase() : searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="input text-sm input-bordered w-1/3"
        />
        <button
          onClick={handleSearch}
          className="btn btn-neutral text-sm text-white"
        >
          Search
        </button>
      </div>

      {mailings.length > 0 ? (
        <>
          <table className="table w-full">
            <thead>
              <tr className="text-sm text-neutral">
                <th>Contractor Name</th>
                <th>Email</th>
                <th>AMO</th>
                <th>TIN</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedMailings.map((mailing) => (
                <tr key={mailing.id} className="text-xs text-zinc-500">
                  <td className="uppercase font-semibold text-zinc-600">{mailing.contractorName}</td>
                  <td className=" w-max">
                    
                    <div className="flex flex-row items-center">
                    {mailing.email && (
                      <button
                        className="btn btn-xs mr-2 text-neutral rounded-none btn-outline"
                        onClick={() => {
                          window.open(
                            `https://compose.mail.yahoo.com/?to=${mailing.email}`,
                            "_blank"
                          );
                        }}
                      >
                        yahoo
                      </button>
                    )}

                    <button
                      data-tip="Copy to clipboard"
                      className="btn btn-xs mr-2 text-neutral border-none tooltip tooltip-top rounded-none btn-outline "
                      onClick={() => {
                        navigator.clipboard.writeText(mailing.email);
                        alert("Email copied to clipboard");
                      }}
                    >
                      {mailing.email}
                    </button>
                    </div>

                  </td>
                  <td className="capitalize">{mailing.amo}</td>
                  <td className="capitalize w-max">
                    {mailing.tin}
                  </td>
                  <td className="capitalize">{mailing.address}</td>
                  <td className="flex gap-2">
                      <button
                        className="btn btn-xs text-neutral btn-outline rounded-none"
                        onClick={() => {
                          setSelectedMailing(mailing);
                          (
                            document.getElementById(
                              "edit_modal"
                            ) as HTMLDialogElement
                          ).showModal();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs text-red-500 btn-outline rounded-none"
                        onClick={() => handleDeleteMailing(mailing.id)}
                      >
                        Delete
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center space-x-2 mt-4"}
            pageClassName={"btn btn-xs"}
            activeClassName={"btn-active"}
            previousClassName={"btn btn-xs"}
            nextClassName={"btn btn-xs"}
          />
        </>
      ) : (
        <p className="text-center mt-4 ">No results found</p>
      )}

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-neutral">Edit Mailing</h3>
          {selectedMailing && (
            <div className="py-4 space-y-5 mt-4">
              <input
                type="text"
                placeholder="Contractor Name"
                className="input uppercase input-sm input-bordered w-full"
                value={selectedMailing.contractorName}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    contractorName: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-sm lowercase input-bordered w-full"
                value={selectedMailing.email}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    email: e.target.value,
                  })
                }
              />
              <input
                type="tin"
                placeholder="TIN Number"
                className="input input-sm lowercase input-bordered w-full"
                value={selectedMailing.tin}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    tin: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="AMO"
                className="input input-sm capitalize input-bordered w-full"
                value={selectedMailing.amo}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    amo: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="input capitalize input-sm input-bordered w-full"
                value={selectedMailing.address}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    address: e.target.value,
                  })
                }
              />
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn rounded-none">Close</button>
              <button
                className="btn btn-neutral rounded-none text-white ml-5"
                onClick={handleUpdateMailing}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SearchMailings;