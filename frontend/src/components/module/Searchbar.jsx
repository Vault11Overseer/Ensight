// frontend/src/components/module/submodule/Searchbar.jsx
//DONE

// SEARCH BAR
// IMPORTS
import { Search as SearchIcon } from "lucide-react";

// EXPORTS
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}) {
  // RETURN
  return (
    // SEARCH CONTAINER
    <div className="relative w-full ">
      {/* ICON */}
      <SearchIcon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60 text-black"
      />
      {/* INPUT */}
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
