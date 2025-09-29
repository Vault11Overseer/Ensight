import React from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search({ placeholder = "Search...", onSearch }) {
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
    <div className="flex w-full p-3 rounded-2xl overflow-hidden bg-[#1E1C29]">
      {/* Input column */}
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className="flex-1 pl-6 text-white placeholder-gray-400 bg-[#1E1C29] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {/* Button column */}
      <button
        type="submit"
        className="w-16 flex items-center justify-center bg-[#272537] hover:bg-[#3b3a50] text-gray-400 transition"
      >
        <SearchIcon size={22} />
      </button>
    </div>
  </form>
</div>


  );
}
