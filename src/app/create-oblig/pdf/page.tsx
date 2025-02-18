/* eslint-disable @next/next/no-img-element */
"use client";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import Draggable from "react-draggable";
import { formatNumber } from "../../../../config/formatNumber";
import { amountToWords } from "../../../../config/amountToWords";

const BondDetails = () => {
  const searchParams = useSearchParams();

  // First, calculate the raw values
  const rawAmount = parseFloat(searchParams.get("amount") || "0");
  const rawLabor = parseFloat(searchParams.get("labor") || "0");
  const rawMaterial = parseFloat(searchParams.get("material") || "0");
  const rawEquipment = parseFloat(searchParams.get("equipment") || "0");

  // Calculate the total raw cost using the formula
  const totalPercentages = rawLabor + rawMaterial + rawEquipment;

  // Calculated individual values
  const calculatedLabor = (rawAmount / totalPercentages) * rawLabor;
  const calculatedMaterial = (rawAmount / totalPercentages) * rawMaterial;
  const calculatedEquipment = (rawAmount / totalPercentages) * rawEquipment;
  const dateValidated = searchParams.get("dateValidated");
  const validatedDate = dateValidated ? new Date(dateValidated) : new Date(); 
  const data = {
    fund: searchParams.get("fund") || "",
    date: searchParams.get("date")
      ? format(new Date(validatedDate), "MMMM d, yyyy")
      : "",
    amount: formatNumber(rawAmount),
    amountWords: amountToWords(rawAmount.toString()),
    contractor: searchParams.get("contractor") || "",
    contractorAddress: searchParams.get("contractorAddress") || "",
    contractorTIN: searchParams.get("contractorTIN") || "",
    contractID: searchParams.get("contractID") || "",
    pmis: searchParams.get("pmis") || "",
    contractName: searchParams.get("contractName") || "",

    // Calculated values
    labor: formatNumber(calculatedLabor.toFixed(2)),
    material: formatNumber(calculatedMaterial.toFixed(2)),
    equipment: formatNumber(calculatedEquipment.toFixed(2)),
    total: formatNumber(rawAmount),

    saro: searchParams.get("saro") || "",
    sourceOfFund: searchParams.get("sourceOfFund") || "",
    uacs: searchParams.get("uacs") || "",
    year: searchParams.get("year") || "",
    endUser: searchParams.get("endUser") || "",
    designation: searchParams.get("designation") || "",
    endUserTitle: searchParams.get("endUserTitle") || "",
  };
  const contentRef = useRef(null);


  return (
    <div className="flex justify-center items-center w-screen h-full overflow-x-hidden">
      <div className="flex flex-col overflow-scroll overflow-x-hidden h-[calc(100vh-5rem)]">
        <div
          id="printable"
          ref={contentRef}
          className="w-[210mm] tahoma h-[297mm] mx-auto text-center bg-white border border-gray-200 shadow-lg"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center p-14 pb-0 mb-[22px]">
            <Draggable>
              <img
                src="/dpwhLogo.png"
                alt="DPWH Logo"
                className="h-24 w-24 object-contain"
              />
            </Draggable>
            <Draggable>
              <div className="text-[14px] text-black">
                <p>Republic of the Philippines</p>
                <p className="">
                  DEPARTMENT OF PUBLIC WORKS AND HIGHWAYS
                </p>
                <p className="text-[12px] font-semibold">
                  MINDORO OCCIDENTAL DISTRICT ENGINEERING OFFICE
                </p>
                <p className="text-[12px]">MIMAROPA REGION(IV-B)</p>
                <p className="text-[12px]">Mamburao, Occidental Mindoro</p>
              </div>
            </Draggable>
            <Draggable>
              <img
                src="/bagongPilipinas.png"
                alt="Bagong Pilipinas"
                className="h-24 w-24 object-contain"
              />
            </Draggable>
          </div>

          <div className="p-[1in] pt-0">
            <div className="flex flex-col-reverse mt-8 mb-[22px] text-[12px]">
              <p className=" text-black border-b border-black w-40 mr-auto ml-0 font-bold">
                {data.date}
              </p>
            </div>

            <div className="flex flex-col-reverse mb-8 text-[12px]">
              <b className="text-black ml-0 mr-auto">MEMORANDUM</b>
            </div>

            <div className="p-1 max-w-4xl mx-auto text-left">
              <div className="space-y-6">
                <div className="text-[11px]">
                  {/* For Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">FOR</div>
                    <div className="col-span-8">
                      <div>: The Budget Officer II</div>
                      <div className="ml-2 ">Accounting Section</div>
                      <div className="ml-2">This District</div>
                    </div>
                  </div>

                  {/* Subject Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4  font-bold">SUBJECT</div>
                    <div className="col-span-8">
                      <div>: Obligation Request</div>
                      <div className="ml-2">
                        This is to request for the issuance of an Obligation for
                        the following:
                      </div>
                    </div>
                  </div>

                  {/* Fund Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">FUND</div>
                    <div className="col-span-8">: {data.fund}</div>
                  </div>

                  {/* Amount Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">AMOUNT</div>
                    <div className="col-span-8">
                      <div className="font-bold">
                        : <span className="ml-2 mr-10">₱</span> {data.amount}
                      </div>
                      <div className="ml-4">{data.amountWords}</div>
                    </div>
                  </div>

                  {/* Payee Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">PAYEE</div>
                    <div className="col-span-8">
                      <div>
                        : <b>{data.contractor}</b>
                      </div>
                      <div className="ml-2">Tin no: {data.contractorTIN}</div>
                    </div>
                  </div>

                  {/* Payee Address Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">
                      PAYEE OFFICE/ADDRESS
                    </div>
                    <div className="col-span-8">: {data.contractorAddress}</div>
                  </div>

                  {/* Particulars Section */}
                  <div className="grid grid-cols-12 gap-2 mb-[22px]">
                    <div className="col-span-4 font-bold">PARTICULARS</div>
                    <div className="col-span-8">
                      <div>
                        <div className="flex gap-1">
                          <span>:</span>
                          <span>
                            To obligate payment for{" "}
                            <b>
                              {data.contractID}
                              {"-"}
                              {data.contractName}
                            </b>
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 ml-2">
                        <div className="grid grid-cols-2 gap-2 mr-40">
                          <div className="">Contract ID:</div>
                          <div className="text-right border-b border-black ">
                            {data.contractID}
                          </div>
                          <div>PMS ID:</div>
                          <div className="text-right border-b border-black ">
                            {data.pmis}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 mr-40">
                          <div>Labor</div>
                          <div className="text-right">{data.labor}</div>
                          <div>Materials</div>
                          <div className="text-right">{data.material}</div>
                          <div>Equipment</div>
                          <div className="text-right border-b border-black ">
                            {data.equipment}
                          </div>
                          <div className="font-bold">TOTAL</div>
                          <div className="text-right font-bold">
                            {data.total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SARO Section */}
                  <div className="grid grid-cols-12 gap-2 mb-1">
                    <div className="col-span-4 font-bold">
                      SARO/SUB-ALLOTMENT NO.
                    </div>
                    <div className="col-span-8">: {data.saro}</div>
                  </div>

                  {/* Source of Fund Section */}
                  <div className="grid grid-cols-12 gap-2 mb-1">
                    <div className="col-span-4 font-bold">SOURCE OF FUND</div>
                    <div className="col-span-8">: {data.sourceOfFund}</div>
                  </div>

                  {/* UACS Section */}
                  <div className="grid grid-cols-12 gap-2 mb-1">
                    <div className="col-span-4 font-bold">UACS No.</div>
                    <div className="col-span-8">: {data.uacs}</div>
                  </div>

                  {/* Fiscal Year Section */}
                  <div className="grid grid-cols-12 gap-2 mb-1">
                    <div className="col-span-4 font-bold">
                      FISCAL YEAR OF ALLOTMENT
                    </div>
                    <div className="col-span-8">: FY {data.year}</div>
                  </div>

                  {/* Certification */}
                  <div className="mt-8">
                    <p>
                      I certify that charges to appropriate/allotment are
                      necessary, lawful and under my direct supervision.
                    </p>
                    <p>
                      I also certify that the supporting documents are valid,
                      proper and legal.
                    </p>
                    <p className="mt-[12px]">Your attention to this matter would be appreciated</p>
                  </div>

                  {/* Signature */}
                  <Draggable>
                    <div className="mt-10 mb-0 mr-0 ml-auto w-1/3 text-center">
                      <div className="uppercase font-bold">{data.endUser}</div>
                      <div>{data.endUserTitle}</div>
                      <div>{data.designation}</div>
                    </div>
                  </Draggable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={()=>window.print()}
        className="fixed bottom-10 right-10 btn btn-neutral mt-5"
      >
        Print
      </button>
    </div>
  );
};

export default BondDetails;