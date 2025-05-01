import { format } from "date-fns";
import { successToast } from "../../../../config/toast";

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex text-xs justify-center items-center">
      <div className="bg-white rounded-lg w-11/12 max-w-5xl shadow-xl max-h-[90vh]">
        <h2 className="text-xl p-6 font-bold shadow text-neutral flex gap-5">
          <p className="font-bold">{contract.contractID}</p>
          <div className="border px-4 flex py-0 text-[0.7rem] text-center border-primary text-primary font-bold rounded-md">
            {contract.status === "proceed" ? "completed" : contract.status}
          </div>
        </h2>

        <div className="grid grid-cols-1 gap-4 border p-6 overflow-scroll max-h-[70vh] overflow-x-hidden">
          <div className="mb-20">
            <div className="block text-wrap">
              <p className="mt-1 w-full mb-20 text-gray-500">
                <button
                  data-tip="Copy to clipboard"
                  className="btn btn-xs mr-2 text-neutral border-none tooltip tooltip-top rounded-none btn-outline "
                  onClick={() => {
                    navigator.clipboard.writeText(contract.projectName);
                    successToast(`${contract.contractID} copied to clipboard`);
                  }}
                >
                  {contract.projectName}
                </button>
              </p>
            </div>

            {/* Dates Section */}
            <div className="mb-2">
              <div className="grid mb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="block">
                  <span className="text-gray-500">Posting Date</span>
                  <p className="mt-1 w-full text-lg font-bold text-neutral">
                    {format(contract.posting, "MMM dd, yyyy")}
                  </p>
                </div>

                <div className="block">
                  <span className="text-gray-500">Pre-Bid Date</span>
                  <p className="mt-1 w-full text-lg font-bold text-neutral">
                    {format(contract.preBid, "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="block">
                  <span className="text-gray-500">Bidding Date</span>
                  <p className="mt-1 w-full text-lg font-bold text-neutral">
                    {format(contract.bidding, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Bid Evaluation Section */}
              <div className="mb-2">
                <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contract.bidEvalStart && contract.bidEvalEnd ? (
                    <div className="block">
                      <span className="font-medium text-gray-700">
                        Bid Evaluation Date
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-600">From:</span>
                          <p className="mt-1 p-2 w-full">
                            {contract.bidEvalStart}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">To:</span>
                          <p className="mt-1 p-2 w-full">
                            {contract.bidEvalEnd}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {contract.postQualStart && contract.postQualEnd ? (
                    <div className="block">
                      <span className="font-medium text-gray-700">
                        Post Qualification Date
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-600">From:</span>
                          <p className="mt-1 p-2 w-full">
                            {contract.postQualStart}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">To:</span>
                          <p className="mt-1 p-2 w-full">
                            {contract.postQualEnd}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Additional Details Section */}
                <div className="mb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {contract.reso ? (
                      <div className="block">
                        <span className="text-gray-500">Resolution</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.reso}
                        </p>
                      </div>
                    ) : null}

                    {contract.noa ? (
                      <div className="block">
                        <span className="text-gray-500">Notice of Award</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.noa}
                        </p>
                      </div>
                    ) : null}

                    {contract.ntp ? (
                      <div className="block">
                        <span className="text-gray-500">Notice to Proceed</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.ntp}
                        </p>
                      </div>
                    ) : null}

                    {contract.ntpRecieve ? (
                      <div className="block">
                        <span className="text-gray-500">NTP Receive Date</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.ntpRecieve}
                        </p>
                      </div>
                    ) : null}

                    {contract.contractDate ? (
                      <div className="block">
                        <span className="text-gray-500">Contract Date</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.contractDate}
                        </p>
                      </div>
                    ) : null}

                    {contract.contractAmount ? (
                      <div className="block">
                        <span className="text-gray-500">Contract Amount</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.contractAmount}
                        </p>
                      </div>
                    ) : null}

                    {contract.contractor ? (
                      <div className="block sm:col-span-2 lg:col-span-3">
                        <span className="text-gray-500">Contractor</span>
                        <p className="mt-1 w-full text-lg font-bold text-neutral">
                          {contract.contractor}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-between gap-4 p-6">
          <div className="border flex p-2 py-1 text-xs text-center border-primary text-primary font-bold rounded-none">
            Batch {contract.batch}
          </div>
          <button
            onClick={onClose}
            className="btn-neutral text-white rounded-none btn btn-xs"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
