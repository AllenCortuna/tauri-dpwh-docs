"use client";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../config/toast";
import Database from "@tauri-apps/plugin-sql";

const SQLiteManager: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if password is correct
    if (password === "OlsenPogi") {
      setShowConfirmation(true);
    } else {
      errorToast("Incorrect password!");
      setPassword("");
    }
  };

  const resetDatabase = async () => {
    setIsLoading(true);
    try {
      const db = await Database.load("sqlite:tauri.db");
      
      // Drop existing tables
      await db.execute("DROP TABLE IF EXISTS contractors");
      await db.execute("DROP TABLE IF EXISTS contracts");
      
      // Recreate tables
      await db.execute(`
        CREATE TABLE IF NOT EXISTS contracts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          batch TEXT NOT NULL,
          year TEXT NOT NULL,
          posting TEXT NOT NULL,
          preBid TEXT NOT NULL,
          bidding TEXT NOT NULL,
          contractID TEXT NOT NULL UNIQUE,
          projectName TEXT NOT NULL,
          status TEXT NOT NULL,
          contractAmount TEXT,
          contractor TEXT,
          bidEvalStart TEXT,
          bidEvalEnd TEXT,
          postQualStart TEXT,
          postQualEnd TEXT,
          reso TEXT,
          noa TEXT,
          ntp TEXT,
          ntpRecieve TEXT,
          contractDate TEXT,
          lastUpdated TEXT NOT NULL
        );
      `);
      await db.execute(`
        CREATE TABLE contractors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contractorName TEXT NOT NULL,
          address TEXT NOT NULL,
          email TEXT,
          amo TEXT,
          designation TEXT,
          tin TEXT,
          lastUpdated TEXT NOT NULL
        );
      `);
      
      successToast("Database has been reset successfully!");
      setShowConfirmation(false);
      setPassword("");
    } catch (error) {
      console.error("Error resetting database:", error);
      errorToast("Failed to reset database. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelReset = () => {
    setShowConfirmation(false);
    setPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />
      
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-neutral mb-6">
          Database Management
        </h1>
        
        {!showConfirmation ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
            
            <button
              type="submit"
              className="btn btn-neutral w-full text-white"
            >
              Verify Password
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-300 rounded-md">
              <h2 className="text-lg font-semibold text-red-600 mb-2">Warning!</h2>
              <p className="text-sm text-red-500">
                You are about to reset the entire database. This action will delete all contractors
                and other data. This action cannot be undone.
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
        )}
      </div>
      
      <div className="mt-8 text-sm text-gray-500 max-w-md text-center">
        <p>
          This utility allows administrators to reset the SQLite database to its initial state.
          All existing data will be permanently deleted.
        </p>
      </div>
    </div>
  );
};

export default SQLiteManager;