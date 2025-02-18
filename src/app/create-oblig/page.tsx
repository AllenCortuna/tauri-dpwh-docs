"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";


const CreateNOA = () => {
  const [data, setData] = useState({
    fund: "",
    date: "",
    amount: "",
    contractor: "",
    contractorAddress: "",
    contractorTIN: "",
    contractID: "",
    pmis: "",
    contractName: "",
    labor: "",
    material: "",
    equipment: "",
    saro: "",
    sourceOfFund: "",
    uacs: "",
    year: "",
    endUser: "",
    designation: "",
    endUserTitle: "",
  });

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setData(JSON.parse(savedData) as typeof data);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = {
      ...data,
      [name]: value,
    } as typeof data;

    // Save to local storage whenever input changes
    localStorage.setItem('formData', JSON.stringify(newData));

    setData(newData);
  };

  return (
    <div className="flex h-full w-screen justify-center">
      <form className="justify-center my-auto mt-10 flex flex-col gap-8 w-auto rounded-none shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-4 gap-8">

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Fund</span>
            <input
              name="fund"
              value={data.fund}
              onChange={handleChange}
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Date</span>
            <input
              name="date"
              value={data.date}
              onChange={handleChange}
              type="date"
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Amount</span>
            <input
              name="amount"
              value={data.amount}
              type="number"
              onChange={handleChange}
              className="custom-input"
            />
          </label>

          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">PMS ID</span>
            <input
              name="pmis"
              value={data.pmis}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contract ID</span>
            <input
              name="contractID"
              value={data.contractID}
              onChange={handleChange}
              className="custom-input"
            />
          </label>

          <label className="flex flex-col col-span-3 text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contract Name</span>
            <input
              name="contractName"
              value={data.contractName}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-2 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contractor</span>
            <input
              name="contractor"
              value={data.contractor}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">
              Contractor Address
            </span>
            <input
              name="contractorAddress"
              value={data.contractorAddress}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Contractor TIN</span>
            <input
              name="contractorTIN"
              value={data.contractorTIN}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-3 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">End User</span>
            <input
              name="endUser"
              value={data.endUser}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Designation</span>
            <input
              name="designation"
              value={data.designation}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">End User Title</span>
            <input
              name="endUserTitle"
              value={data.endUserTitle}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-3 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Labor</span>
            <input
              name="labor"
              type="number"
              value={data.labor}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Material</span>
            <input
              name="material"
              type="number"
              value={data.material}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Equipment</span>
            <input
              name="equipment"
              type="number"
              value={data.equipment}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>

        <span className="grid grid-cols-4 border-t pt-5 gap-8">
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">SARO</span>
            <input
              name="saro"
              value={data.saro}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Source of Fund</span>
            <input
              name="sourceOfFund"
              value={data.sourceOfFund}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">UACS</span>
            <input
              name="uacs"
              value={data.uacs}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="text-xs text-zinc-500 mb-2">Year</span>
            <input
              name="year"
              value={data.year}
              onChange={handleChange}
              className="custom-input"
            />
          </label>
        </span>
      </form>


      <span className="mb-5 ml-auto mr-0 flex flex-row gap-10 fixed bottom-10 right-10">

        <Link
          type="submit"
          target="_blank"
          rel="noopener noreferrer"
          href={`http://localhost:9527/create-oblig/pdf?${new URLSearchParams(
            data
          ).toString()}`}
          className="btn btn-neutral text-xs w-60 shadow-xl rounded-none"
        >
          Submit
        </Link>
      </span>
    </div>
  );
};

export default CreateNOA;