"use client";
import React, { useState, FormEvent } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../../config/toast";
import Database from "@tauri-apps/plugin-sql";

interface UpdateFormData {
  bidEvalStart: string;
  bidEvalEnd: string;
  postQualStart: string;
  postQualEnd: string;
  reso: string;
  noa: string;
  ntp: string;
  ntpRecieve: string;
  contractDate: string;
}

const UpdateMultipleContract: React.FC = () => {
  const [contractIDs, setContractIDs] = useState<string[]>([]);
  const [newContractID, setNewContractID] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    bidEvalStart: "",
    bidEvalEnd: "",
    postQualStart: "",
    postQualEnd: "",
    reso: "",
    noa: "",
    ntp: "",
    ntpRecieve: "",
    contractDate: "",
  });

  // Add this new function after the component state declarations
  const validateContractID = async (contractID: string): Promise<boolean> => {
    try {
      const db = await Database.load("sqlite:tauri.db");
      const result = await db.select<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM contracts WHERE contractID = ?",
        [contractID.trim()]
      );
      return result[0].count > 0;
    } catch (error) {
      console.error("Error validating contract ID:", error);
      return false;
    }
  };

  // Modify the handleAddContractID function
  const handleAddContractID = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedID = newContractID.trim();

    if (!trimmedID) {
      errorToast("Please enter a Contract ID");
      return;
    }

    if (contractIDs.includes(trimmedID)) {
      errorToast("Contract ID already added to the list");
      return;
    }

    const exists = await validateContractID(trimmedID);
    if (!exists) {
      errorToast("Contract ID not found in database");
      return;
    }

    setContractIDs([...contractIDs, trimmedID]);
    setNewContractID("");
    successToast("Contract ID added successfully");
  };

  const handleRemoveContractID = (id: string) => {
    setContractIDs(contractIDs.filter((contractID) => contractID !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (contractIDs.length === 0) {
      errorToast("Please add at least one Contract ID");
      return;
    }

    setIsLoading(true);
    try {
      const db = await Database.load("sqlite:tauri.db");
      let updateCount = 0;

      // Build the dynamic UPDATE query based on non-empty fields
      const updateFields: string[] = [];
      const updateValues: string[] = [];

      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim() !== "") {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      });

      if (updateFields.length === 0) {
        errorToast("Please fill at least one field to update");
        setIsLoading(false);
        return;
      }

      // Add status update logic
      let status = null;
      if (formData.noa && formData.ntp) {
        status = "proceed";
      } else if (formData.noa) {
        status = "awarded";
      }

      if (status) {
        updateFields.push("status = ?");
        updateValues.push(status);
      }

      // Add lastUpdated field
      updateFields.push("lastUpdated = ?");
      updateValues.push(new Date().toISOString());

      const updateQuery = `
        UPDATE contracts 
        SET ${updateFields.join(", ")}
        WHERE contractID = ?
      `;

      for (const contractID of contractIDs) {
        try {
          const result = await db.execute(updateQuery, [
            ...updateValues,
            contractID,
          ]);
          if (result.rowsAffected > 0) {
            updateCount++;
          }
        } catch (error) {
          console.error(`Error updating contract ${contractID}:`, error);
        }
      }

      successToast(`Successfully updated ${updateCount} contracts`);

      // Reset form if all updates were successful
      if (updateCount === contractIDs.length) {
        setFormData({
          bidEvalStart: "",
          bidEvalEnd: "",
          postQualStart: "",
          postQualEnd: "",
          reso: "",
          noa: "",
          ntp: "",
          ntpRecieve: "",
          contractDate: "",
        });
        setContractIDs([]);
      }
    } catch (error) {
      console.error("Error updating contracts:", error);
      errorToast("Failed to update contracts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          Update Multiple Contracts
        </h1>

        {/* Contract ID Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleAddContractID} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newContractID}
              onChange={(e) => setNewContractID(e.target.value)}
              placeholder="Enter Contract ID"
              className="flex-1 p-2 border rounded text-xs"
            />
            <button
              type="submit"
              className="btn btn-sm btn-neutral text-white rounded-none shadow-md"
            >
              Submit
            </button>
          </form>

          {/* Display Contract IDs */}
          <div className="flex flex-wrap gap-2">
            {contractIDs.map((id) => (
              <div
                key={id}
                className="bg-gray-100 border px-3 py-1 rounded-lg text-xs flex items-center gap-2"
              >
                <span>{id}</span>
                <button
                  onClick={() => handleRemoveContractID(id)}
                  className="text-red-500 text-lg hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 text-xs rounded-lg shadow-md space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <div className="block">
              <span className="font-medium text-gray-500">
                Bid Evaluation Start
              </span>
              <input
                type="date"
                name="bidEvalStart"
                value={formData.bidEvalStart}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">
                Bid Evaluation End
              </span>
              <input
                type="date"
                name="bidEvalEnd"
                value={formData.bidEvalEnd}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">
                Post Qualification Start
              </span>
              <input
                type="date"
                name="postQualStart"
                value={formData.postQualStart}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">
                Post Qualification End
              </span>
              <input
                type="date"
                name="postQualEnd"
                value={formData.postQualEnd}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">Resolution</span>
              <input
                type="date"
                name="reso"
                value={formData.reso}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">NOA</span>
              <input
                type="date"
                name="noa"
                value={formData.noa}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">NTP</span>
              <input
                type="date"
                name="ntp"
                value={formData.ntp}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">NTP Receive</span>
              <input
                type="date"
                name="ntpRecieve"
                value={formData.ntpRecieve}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-500">Contract Date</span>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex w-full justify-center">
            <button
              type="submit"
              disabled={isLoading || contractIDs.length === 0}
              className={`btn mx-auto mt-10 p-2 rounded text-white ${
                isLoading || contractIDs.length === 0
                  ? "btn-disabled"
                  : "btn-neutral text-white"
              }`}
            >
              {isLoading ? "Updating..." : "Update Contracts"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateMultipleContract;
