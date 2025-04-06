import React from "react";
import Link from "next/link";

const NavLinks: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        href="/dashboard/search-contract"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        search
      </Link>
      <Link
        href="/dashboard/update-contract"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        update
      </Link>
      <Link
        href="/dashboard/create-contract"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        create
      </Link>
    </div>
  );
};

export default NavLinks;
