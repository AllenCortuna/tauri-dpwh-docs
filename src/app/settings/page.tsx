"use client";
import React from 'react';
import useSelectDatabase from '../../../config/useSelectDatabase';

const Settings = () => {
  const { databaseType, handleToggle } = useSelectDatabase();

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Database Type</h2>
        <p className="text-xs text-gray-600 mb-4">
          Select which database type to use for the application.
        </p>
        
        <div className="flex items-center text-sm space-x-10 mt-8">
          <button
            onClick={() => handleToggle('contracts')}
            className={`px-4 py-2 rounded-md transition-colors ${
              databaseType === 'contracts'
                ? 'bg-lime-600 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Infra
          </button>
          
          <button
            onClick={() => handleToggle('goods')}
            className={`px-4 py-2 rounded-md transition-colors ${
              databaseType === 'goods'
                ? 'bg-lime-600 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Goods
          </button>
        </div>
        
        <p className="p-3 mt-8 text-xs text-gray-500">
          Current selection: <span className="font-medium">{databaseType === "goods" ? "Goods and Services" : "Civil Works"}</span>
        </p>
      </div>
    </div>
  );
};

export default Settings;