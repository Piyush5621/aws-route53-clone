"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Filter resources by property or value...",
  onClear,
}) => {
  return (
    <div className="relative flex items-center bg-[#0f1b2a] border border-[#384c63] rounded px-3 py-1.5 text-xs text-gray-300 w-full sm:w-80 focus-within:border-[#ec7211] transition-all">
      <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          className="text-gray-400 hover:text-white p-0.5 ml-1"
          title="Clear filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
