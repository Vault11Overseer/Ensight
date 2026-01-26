// import React from "react";
import { Eye } from "lucide-react";

export default function ImageCard({ image, onOpen }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow group bg-white dark:bg-gray-800">
      {/* IMAGE */}
      <div className="relative h-48 w-full">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />

        {/* ACTIONS */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={() => onOpen(image)}
            className="bg-[#BDD63B] hover:bg-[#a4c12d] p-3 rounded-full text-black"
            title="View Image"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* TITLE */}
      <div className="p-3">
        <h3 className="font-semibold truncate">
          {image.title}
        </h3>
      </div>
    </div>
  );
}
