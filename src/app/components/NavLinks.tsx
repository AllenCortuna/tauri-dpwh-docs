import React from "react";
import Link from "next/link";

const NavLinks: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        href="/"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        home
      </Link>
      <Link
        href="/update-contract"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        update
      </Link>
      <Link
        href="/create-contract"
        className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
      >
        create
      </Link>
    </div>
  );
};

export default NavLinks;