import React from "react";
import Link from "next/link";

const ContractorNav: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        href="/"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-primary hover:btn-outline transition-colors"
      >
        home
      </Link>
      <Link
        href="/contractors/add"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-white  hover:bg-primary hover:btn-outline transition-colors"
      >
        create
      </Link>
      <Link
        href="/contractors/search"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-primary hover:btn-outline transition-colors"
      >
        search
      </Link>
    </div>
  );
};

export default ContractorNav;