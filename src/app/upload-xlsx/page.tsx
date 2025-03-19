'use client';

import React from 'react';
import Link from 'next/link';
import { FaFileContract, FaFileUpload } from 'react-icons/fa';

export default function UploadXlsxPage() {
  const menuItems = [
    {
      title: 'Contract',
      description: 'Upload and manage contract documents',
      icon: <FaFileContract className="text-4xl text-blue-600" />,
      href: '/upload-xlsx/contract',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      title: 'Contractor',
      description: 'Upload and manage list of contractors',
      icon: <FaFileUpload className="text-4xl text-green-600" />,
      href: '/upload-xlsx/contractor',
      color: 'bg-green-100 hover:bg-green-200',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Document Management</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your XLSX documents for contracts and projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <Link 
            href={item.href} 
            key={index}
            className={`${item.color} rounded-lg p-6 shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
        <div className="text-gray-500 text-center py-8">
          No recent uploads found. Start by uploading a document.
        </div>
      </div>
    </div>
  );
}