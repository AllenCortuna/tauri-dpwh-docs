"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Database from "@tauri-apps/plugin-sql";
import Link from "next/link";

interface Contract {
  contractID: string;
  contractName: string;
  budget: string;
  date: string;
  category: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize database connection
      const db = await Database.load("sqlite:tauri.db");

      // Query the contracts table based on the search query
      const results = await db.select<Contract[]>(
        `SELECT * FROM contracts
         WHERE contractID LIKE ? OR contractName LIKE ? OR category LIKE ?`,
        [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
      );

      // Update search results
      setSearchResults(results);
      console.log("Search results:", results);
    } catch (error) {
      console.error("Error searching data:", error);
      alert("Failed to search data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <h1 className="text-2xl font-bold mb-6">Search Contracts</h1>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Contract ID, Name, or Category"
          className="custom-input flex-grow"
        />
        <button
          type="submit"
          className={`btn ${isLoading ? "btn-disable" : "btn-neutral"}`}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Contract ID</th>
                <th>Contract Name</th>
                <th>Budget</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((contract) => (
                <tr key={contract.contractID}>
                  <td>{contract.contractID}</td>
                  <td>{contract.contractName}</td>
                  <td>{contract.budget}</td>
                  <td>{contract.date}</td>
                  <td>{contract.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">
        <p className="text-gray-500">No results found.</p>
        <Link
        href={"/create-strike"}
        className="btn btn-neutral text-xs w-80"
      >
        Create Strike
      </Link>
      </div>
      )}
    </div>
  );
};

export default SearchPage;