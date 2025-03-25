"use client";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../config/toast";
import { executeQuery, selectQuery } from "../../../config/mssql";
import { save, open } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";

const DatabaseManager: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [exportImportLoading, setExportImportLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password is correct
    if (password === "AllenCortuna") {
      setIsAuthenticated(true);
      setShowConfirmation(false);
    } else {
      errorToast("Incorrect password!");
      setPassword("");
    }
  };

  const resetDatabase = async () => {
    setIsLoading(true);
    try {
      // Drop existing tables if they exist
      await executeQuery("IF OBJECT_ID('contractors', 'U') IS NOT NULL DROP TABLE contractors");
      await executeQuery("IF OBJECT_ID('contracts', 'U') IS NOT NULL DROP TABLE contracts");

      // Create tables with SQL Server syntax
      await executeQuery(`
        CREATE TABLE contracts (
          id INT IDENTITY(1,1) PRIMARY KEY,
          batch NVARCHAR(255) NOT NULL,
          year NVARCHAR(255) NOT NULL,
          posting NVARCHAR(255) NOT NULL,
          preBid NVARCHAR(255) NOT NULL,
          bidding NVARCHAR(255) NOT NULL,
          contractID NVARCHAR(255) NOT NULL UNIQUE,
          projectName NVARCHAR(MAX) NOT NULL,
          status NVARCHAR(255) NOT NULL,
          contractAmount NVARCHAR(255),
          contractor NVARCHAR(255),
          bidEvalStart NVARCHAR(255),
          bidEvalEnd NVARCHAR(255),
          postQualStart NVARCHAR(255),
          postQualEnd NVARCHAR(255),
          reso NVARCHAR(255),
          noa NVARCHAR(255),
          ntp NVARCHAR(255),
          ntpRecieve NVARCHAR(255),
          contractDate NVARCHAR(255),
          lastUpdated NVARCHAR(255) NOT NULL
        )
      `);
      
      await executeQuery(`
        CREATE TABLE contractors (
          id INT IDENTITY(1,1) PRIMARY KEY,
          contractorName NVARCHAR(255) NOT NULL,
          address NVARCHAR(MAX) NOT NULL,
          email NVARCHAR(255),
          amo NVARCHAR(255),
          designation NVARCHAR(255),
          tin NVARCHAR(255),
          lastUpdated NVARCHAR(255) NOT NULL
        )
      `);

      successToast("Database has been reset successfully!");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error resetting database:", error);
      errorToast("Failed to reset database. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportDatabase = async () => {
    setExportImportLoading(true);
    try {
      // Get all contractors
      const contractors = await selectQuery("SELECT * FROM contractors");

      // Get all contracts
      const contracts = await selectQuery("SELECT * FROM contracts");

      // Prepare data for export
      const exportData = JSON.stringify(
        {
          contractors,
          contracts,
        },
        null,
        2
      );

      // Open save dialog
      const filePath = await save({
        filters: [
          {
            name: "Database Backup",
            extensions: ["json"],
          },
        ],
        defaultPath: "dpwh_database_backup.json",
      });

      if (filePath) {
        await writeFile(filePath, new TextEncoder().encode(exportData));
        successToast("Database exported successfully!");
      }
    } catch (error) {
      console.error("Error exporting database:", error);
      errorToast(`Failed to export database: ${error}`);
    } finally {
      setExportImportLoading(false);
    }
  };

  const importDatabase = async () => {
    setExportImportLoading(true);
    try {
      // Open file dialog
      const selected = await open({
        filters: [
          {
            name: "Database Backup",
            extensions: ["json"],
          },
        ],
        multiple: false,
      });

      if (!selected) {
        setExportImportLoading(false);
        return;
      }

      // Read the file
      const fileContent = await readFile(selected as string);
      const importData = JSON.parse(new TextDecoder().decode(fileContent));

      // Connect to database
      const db = await Database.load("sqlite:tauri.db");

      // Clear existing data
      await resetDatabase();

      // Insert contractors with SQL Server syntax
      for (const contractor of importData.contractors) {
        const { id, ...contractorData } = contractor; // Remove id to let SQL Server auto-increment
        const keys = Object.keys(contractorData).join(", ");
        const placeholders = Object.keys(contractorData)
          .map((_, index) => `@param${index}`)
          .join(", ");
        const values = Object.values(contractorData);

        await executeQuery(
          `INSERT INTO contractors (${keys}) VALUES (${placeholders})`,
          values
        );
      }

      // Insert contracts with SQL Server syntax
      for (const contract of importData.contracts) {
        const { id, ...contractData } = contract; // Remove id to let SQL Server auto-increment
        const keys = Object.keys(contractData).join(", ");
        const placeholders = Object.keys(contractData)
          .map((_, index) => `@param${index}`)
          .join(", ");
        const values = Object.values(contractData);

        await executeQuery(
          `INSERT INTO contracts (${keys}) VALUES (${placeholders})`,
          values
        );
      }

      successToast("Database imported successfully!");
    } catch (error) {
      console.error("Error importing database:", error);
      errorToast(`Failed to import database: ${error}`);
    } finally {
      setExportImportLoading(false);
    }
  };

  const cancelReset = () => {
    setShowConfirmation(false);
  };

  const showResetConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-neutral mb-6">
          Database Management
        </h1>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="custom-input w-full"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button type="submit" className="btn btn-neutral w-full text-white">
              Verify Password
            </button>
          </form>
        ) : showConfirmation ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-300 rounded-md">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                Warning!
              </h2>
              <p className="text-sm text-red-500">
                You are about to reset the entire database. This action will
                delete all contractors and other data. This action cannot be
                undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={cancelReset}
                className="btn btn-outline flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                onClick={resetDatabase}
                className="btn btn-error flex-1 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Database"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Database Actions */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-700">
                Database Actions
              </h2>

              <button
                onClick={showResetConfirmation}
                className="btn btn-error w-full text-white"
              >
                Reset Database
              </button>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm mt-3 font-medium text-gray-700 mb-3">
                  Backup & Restore
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={exportDatabase}
                    className="btn btn-outline text-neutral flex-1"
                    disabled={exportImportLoading}
                  >
                    {exportImportLoading ? "Processing..." : "Export"}
                  </button>

                  <button
                    onClick={importDatabase}
                    className="btn btn-outline text-neutral flex-1"
                    disabled={exportImportLoading}
                  >
                    {exportImportLoading ? "Processing..." : "Import"}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t flex items-center justify-center border-gray-200">
              <button
                onClick={handleLogout}
                className="btn btn-error text-white mx-auto btn-sm mt-5"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-xs text-gray-500 max-w-md text-center">
        <p>
          This utility allows administrators to manage the SQLite database:
          reset to initial state, export data for backup, or import data from a
          backup file. All operations require admin authentication.
        </p>
      </div>
    </div>
  );
};

export default DatabaseManager;
