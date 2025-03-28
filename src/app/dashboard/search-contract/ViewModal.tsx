interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}
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

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, contract }) => {
  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex text-xs justify-center items-center">
      <div className="bg-white p-6 md:p-8 rounded-lg w-11/12 max-w-5xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-10 text-gray-800 flex gap-5">
          <p className="font-bold">{contract.contractID}</p>
          <div className="border px-4 flex py-0 text-[0.7rem] text-center border-primary text-primary font-bold rounded-md">
            {contract.status}
          </div>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Basic Information Section */}
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="block">
                <span className="font-medium text-gray-700">Batch</span>
                <p className="mt-1 p-2 w-full">{contract.batch}</p>
              </div>
              <div className="block col-span-2 lg:col-span-2">
                <span className="font-medium text-gray-700">Project Name</span>
                <p className="mt-1 p-2 w-full">{contract.projectName}</p>
              </div>
            </div>

            {/* Dates Section */}
            <div className="mb-2">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Important Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="block">
                  <span className="font-medium text-gray-700">Posting Date</span>
                  <p className="mt-1 p-2 w-full">{contract.posting}</p>
                </div>
                <div className="block">
                  <span className="font-medium text-gray-700">Pre-Bid Date</span>
                  <p className="mt-1 p-2 w-full">{contract.preBid}</p>
                </div>
                <div className="block">
                  <span className="font-medium text-gray-700">Bidding Date</span>
                  <p className="mt-1 p-2 w-full">{contract.bidding}</p>
                </div>
              </div>

              {/* Bid Evaluation Section */}
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Bid Evaluation Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="block">
                    <span className="font-medium text-gray-700">Bid Evaluation Date</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-600">From:</span>
                        <p className="mt-1 p-2 w-full">{contract.bidEvalStart}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">To:</span>
                        <p className="mt-1 p-2 w-full">{contract.bidEvalEnd}</p>
                      </div>
                    </div>
                  </div>

                  <div className="block">
                    <span className="font-medium text-gray-700">Post Qualification Date</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-600">From:</span>
                        <p className="mt-1 p-2 w-full">{contract.postQualStart}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">To:</span>
                        <p className="mt-1 p-2 w-full">{contract.postQualEnd}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Additional Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="block">
                      <span className="font-medium text-gray-700">Resolution</span>
                      <p className="mt-1 p-2 w-full">{contract.reso}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">Notice of Award</span>
                      <p className="mt-1 p-2 w-full">{contract.noa}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">Notice to Proceed</span>
                      <p className="mt-1 p-2 w-full">{contract.ntp}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">NTP Receive Date</span>
                      <p className="mt-1 p-2 w-full">{contract.ntpRecieve}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">Contract Date</span>
                      <p className="mt-1 p-2 w-full">{contract.contractDate}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">Contract Amount</span>
                      <p className="mt-1 p-2 w-full">{contract.contractAmount}</p>
                    </div>
                    <div className="block">
                      <span className="font-medium text-gray-700">Contractor</span>
                      <p className="mt-1 p-2 w-full">{contract.contractor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="btn-outline text-gray-700 rounded-none shadow-md btn btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;