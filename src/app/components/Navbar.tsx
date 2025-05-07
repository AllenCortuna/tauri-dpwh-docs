"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import dpwhLogo from "../../../public/dpwhLogo.png";
import { useAuthStore } from "../../../config/authStore";
import { useLogin } from "../../../config/useLogin";
import useSelectDatabase from '../../../config/useSelectDatabase';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore(); // Get auth state directly from store
  const { logout } = useLogin();
  const { databaseType } = useSelectDatabase(); // Using Zustand store now

  return (
    <nav className="border-b-2 border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-6 h-16">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={dpwhLogo}
              alt="DPWH Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <span className="flex mt-1 font-bold text-xs text-gray-700 tracking-wide">MODEO {databaseType === "goods" ? "Goods and Services" : "Civil Works" }</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
            >
              Home
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-primary hover:btn-outline transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Add login/logout to mobile menu */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
