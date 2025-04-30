// EditModal.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

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

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editFormData: Contract | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

interface Contractor {
  id: number;
  contractorName: string;
  email: string;
  amo: string;
  designation: string;
  tin: string;
  address: string;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  editFormData,
  onFormChange,
  onSave,
}) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>(
    []
  );
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const contractorDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch contractors from database on component mount
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const result: { rows: Contractor[] } = await invoke(
          "execute_mssql_query",
          {
            queryRequest: {
              query: "SELECT id,* FROM contractors",
            },
          }
        );
        setContractors(result.rows);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };

    fetchContractors();
  }, []);

  // Handle click outside contractor dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contractorDropdownRef.current &&
        !contractorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowContractorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen || !editFormData) return null;

  // Modify onFormChange to handle contractor filtering
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange(e);

    if (name === "contractor") {
      if (value.trim() === "") {
        setFilteredContractors([]);
        setShowContractorDropdown(false);
      } else {
        const regex = new RegExp(value, "i");
        const filtered = contractors.filter((c) =>
          regex.test(c.contractorName)
        );
        setFilteredContractors(filtered);
        setShowContractorDropdown(true);
      }
    }
  };

  const handleContractorSelect = (contractor: Contractor) => {
    // Update the contractor field
    onFormChange({
      target: {
        name: "contractor",
        value: contractor.contractorName,
      },
    } as React.ChangeEvent<HTMLInputElement>);

    setShowContractorDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
      <div className="bg-white p-6 md:p-8 rounded-lg w-11/12 max-w-5xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-10 text-gray-800 flex gap-5">
          <p>{editFormData.contractID}</p>
          <div className="border px-4 flex py-0 text-[0.7rem] text-center border-primary text-primary font-bold rounded-md">
            {editFormData?.status}
          </div>
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="block">
              <span className="font-medium text-gray-700">Batch</span>
              <input
                type="text"
                name="batch"
                value={editFormData.batch}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="block col-span-2 lg:col-span-2">
              <span className="font-medium text-gray-700">Project Name</span>
              <input
                type="text"
                name="projectName"
                value={editFormData.projectName}
                onChange={onFormChange}
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
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">Pre-Bid Date</span>
              <input
                type="date"
                name="preBid"
                value={editFormData.preBid}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">Bidding Date</span>
              <input
                type="date"
                name="bidding"
                value={editFormData.bidding}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Bid Evaluation Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="block">
              <span className="font-medium text-gray-700">
                Bid Evaluation Date
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-gray-600">From:</span>
                  <input
                    type="date"
                    name="bidEvalStart"
                    value={editFormData.bidEvalStart || ""}
                    onChange={onFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-600">To:</span>
                  <input
                    type="date"
                    name="bidEvalEnd"
                    value={editFormData.bidEvalEnd || ""}
                    onChange={onFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">
                Post Qualification Date
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-gray-600">From:</span>
                  <input
                    type="date"
                    name="postQualStart"
                    value={editFormData.postQualStart || ""}
                    onChange={onFormChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-600">To:</span>
                  <input
                    type="date"
                    name="postQualEnd"
                    value={editFormData.postQualEnd || ""}
                    onChange={onFormChange}
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
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">Notice of Award</span>
              <input
                type="date"
                name="noa"
                value={editFormData.noa || ""}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">
                Notice to Proceed
              </span>
              <input
                type="date"
                name="ntp"
                value={editFormData.ntp || ""}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">
                NTP Receive Date
              </span>
              <input
                type="date"
                name="ntpRecieve"
                value={editFormData.ntpRecieve || ""}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">Contract Date</span>
              <input
                type="date"
                name="contractDate"
                value={editFormData.contractDate || ""}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <span className="font-medium text-gray-700">Contract Amount</span>
              <input
                type="text"
                name="contractAmount"
                value={editFormData.contractAmount || ""}
                onChange={onFormChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>

            <div className="block">
              <div className="block relative">
                <span className="font-medium text-gray-700">Contractor</span>
                <input
                  type="text"
                  name="contractor"
                  value={editFormData.contractor || ""}
                  autoComplete="off"
                  onChange={handleFormChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
                {showContractorDropdown && filteredContractors.length > 0 && (
                  <div
                    ref={contractorDropdownRef}
                    className="absolute z-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {filteredContractors.map((contractor) => (
                      <div
                        key={contractor.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleContractorSelect(contractor)}
                      >
                        <div className="font-medium">
                          {contractor.contractorName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {contractor.address}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="block"></div>
            <div className="block">
              <span className="font-medium text-gray-700">Year</span>
              <input
                type="text"
                name="year"
                value={editFormData.year || ""}
                onChange={(e) => {
                  // Only allow 4 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  onFormChange({
                    ...e,
                    target: {
                      ...e.target,
                      value,
                      name: 'year'
                    }
                  });
                }}
                pattern="\d{4}"
                maxLength={4}
                placeholder="YYYY"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="btn-outline text-gray-700 rounded-none shadow-md btn btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="btn btn-neutral rounded-none shadow-md text-white btn-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
