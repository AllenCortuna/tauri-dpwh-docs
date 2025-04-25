"use client";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { successToast } from "../../../../config/toast";
import { ToastContainer } from "react-toastify";
import { invoke } from "@tauri-apps/api/core";

interface Mailing {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  designation: string;
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
  const [selectedMailingName, setSelectedMailingName] = useState<string>("");
  const itemsPerPage = 10;

  // Remove database initialization since we're using MSSQL
  useEffect(() => {}, []);

  const handleSearch = async () => {
    try {
      // Build the SQL query based on the search field and term
      const query = `SELECT * FROM contractors WHERE ${searchField} LIKE @p1`;
      const searchPattern = `%${searchTerm}%`;

      // Execute the query using invoke
      const result = await invoke("execute_mssql_query", {
        queryRequest: {
          query,
          params: [searchPattern],
        },
      });

      // Update state with results
      setMailings((result as { rows: Mailing[] }).rows);
      setTotalPages(Math.ceil((result as{ rows: Mailing[] }).rows.length / itemsPerPage));
      setCurrentPage(0);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleUpdateMailing = async () => {
    if (!selectedMailing) return;

    try {
      // Update the contractor in the database using invoke
      await invoke("execute_mssql_query", {
        queryRequest: {
          query: `
            UPDATE contractors SET 
              contractorName = @p1, 
              email = @p2, 
              amo = @p3, 
              tin = @p4, 
              address = @p5, 
              lastUpdated = @p6
            WHERE contractorName = @p7
          `,
          params: [
            selectedMailing.contractorName,
            selectedMailing.email,
            selectedMailing.amo,
            selectedMailing.tin,
            selectedMailing.address,
            new Date().toISOString(),
            selectedMailingName // Use selectedMailingName as the unique identifier
          ],
        },
      });

      // Refresh search results
      handleSearch();

      // Close modal
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteMailing = async (contractorName: string) => {
    // Get the contractor name for the confirmation message
    const contractor = mailings.find((m) => m.contractorName === contractorName);
    if (!contractor) return;

    // Show confirmation dialog
    const confirmation = await confirm(
      `This action cannot be reverted. Are you sure you want to delete ${contractor.contractorName}?`,
      { title: "Tauri", kind: "warning" }
    );

    if (!confirmation) return;

    try {
      // Delete the contractor using invoke
      await invoke("execute_mssql_query", {
        queryRequest: {
          query: "DELETE FROM contractors WHERE contractorName = @p1",
          params: [contractorName],
        },
      });

      // Refresh search results
      handleSearch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Update the debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string, field: string) => {
      try {
        const query = `SELECT * FROM contractors WHERE ${field} LIKE @p1`;
        const searchPattern = `%${term}%`;

        const result = await invoke("execute_mssql_query", {
          queryRequest: {
            query,
            params: [searchPattern],
          },
        });

        setMailings((result as {rows: Mailing[]}).rows);
        setTotalPages(Math.ceil((result as {rows: Mailing[]}).rows.length / itemsPerPage));
        setCurrentPage(0);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300),
    []
  );

  const displayedMailings = mailings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // Update the input handler
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      searchField === "contractorName"
        ? e.target.value.toUpperCase()
        : e.target.value;
    setSearchTerm(value);
    debouncedSearch(value, searchField);
  };

  // Update the select handler
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
    debouncedSearch(searchTerm, e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex mb-4 gap-2">
        <select
          value={searchField}
          onChange={handleFieldChange}
          className="custom-input w-52"
        >
          <option value="contractorName">Contractor Name</option>
          <option value="email">Email</option>
          <option value="amo">Representative</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInput}
          placeholder="Search..."
          className="custom-input w-1/3"
        />
        {/* Remove the search button since search is now automatic */}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedMailings.map((mailing) => (
                <tr key={mailing.contractorName} className="text-xs text-zinc-500">
                  <td className="uppercase font-semibold text-zinc-600">
                    <button
                      data-tip="Copy to clipboard"
                      className="btn btn-xs mr-2 w-80 text-left text-neutral border-none tooltip tooltip-top rounded-none btn-outline"
                      onClick={() => {
                        navigator.clipboard.writeText(mailing.contractorName);
                        successToast(
                          `${mailing.contractorName} copied to clipboard`
                        );
                      }}
                    >
                      {mailing.contractorName}
                    </button>
                  </td>
                  <td className=" w-max">
                    <button
                      data-tip="Copy to clipboard"
                      className="btn btn-xs mr-2 text-neutral border-none tooltip tooltip-top rounded-none btn-outline "
                      onClick={() => {
                        navigator.clipboard.writeText(mailing.email);
                        successToast(`${mailing.email} copied to clipboard`);
                      }}
                    >
                      {mailing.email}
                    </button>
                  </td>
                  <td className="capitalize">{mailing.amo}</td>
                  <td className="capitalize w-max">{mailing.tin}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs text-neutral btn-outline rounded-none"
                      onClick={() => {
                        setSelectedMailing(mailing);
                        setSelectedMailingName(mailing.contractorName);
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
                      onClick={() => handleDeleteMailing(mailing.contractorName)}
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
        <p className="px-3 py-2 rounded-md mx-auto text-xs font-bold w-max mt-20 text-gray-700 bg-white transition-colors">
          No results found
        </p>
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
                placeholder="Designation"
                className="input input-sm capitalize input-bordered w-full"
                value={selectedMailing.designation}
                onChange={(e) =>
                  setSelectedMailing({
                    ...selectedMailing,
                    designation: e.target.value,
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
