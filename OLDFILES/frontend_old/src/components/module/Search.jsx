// frontend/src/components/module/Search.jsx

// ======================================
// SEARCH
// ======================================

// ======================================
// IMPORTS
// ======================================
import React from "react";
import { Search as SearchIcon } from "lucide-react";

// ======================================
// SEARCH FUNCTION
// ======================================
export default function Search({ placeholder = "Search...", onSearch }) {
  // ======================================
  // RETURN
  // ======================================
  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSearch) {
            const value = e.target.elements.search.value;
            onSearch(value);
          }
        }}
        className="w-full "
      >
        <div className="flex w-full p-3 rounded-2xl overflow-hidden bg-white">
          {/* INPUT COLUMN */}
          <input
            type="text"
            name="search"
            placeholder={placeholder}
            className="flex-1 pl-6 text-black placeholder-black-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* BUTTON COLUMN */}
          <button
            type="submit"
            className="w-16 flex items-center justify-center bg-white hover:bg-[#263248] text-gray-400 transition"
          >
            <SearchIcon size={22} />
          </button>
        </div>
      </form>
    </div>
  );
}
