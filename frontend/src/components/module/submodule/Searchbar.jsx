import React from "react";
import { Search as SearchIcon } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}) {
  return (
    <div className="relative w-full ">
      <SearchIcon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60 text-black"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-black outline-none shadow"
      />
    </div>
  );
}
