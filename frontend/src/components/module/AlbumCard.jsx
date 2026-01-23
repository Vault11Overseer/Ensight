import React from "react";
import { Image, User, Trash2, Pencil } from "lucide-react";
import defaultImage from "/default_album_image.png";
import { useNavigate } from "react-router-dom";

export default function AlbumCard({
  album,
  canEdit,
  onOpen,
  onDelete,
  darkMode,
}) {


  const navigate = useNavigate();
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow group bg-white dark:bg-gray-800  ${
      darkMode
        ? "border border-[#BDD63B]"
        : "border border-[#263248]"
    }`}
    >
      {/* IMAGE */}
      <div className="relative h-48 w-full">
        <img
          // src={album.cover_image_url || defaultImage}
          src={album.cover_image_url?.trim() ? album.cover_image_url : defaultImage}

          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />

        {/* OWNER ICON */}
        {album.owner_user_id && (
          <div className="absolute top-2 left-2 bg-white text-red-500 rounded-full p-1 shadow">
            <User size={16} />
          </div>
        )}

        {/* ACTIONS */}
        {canEdit && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
            {/* VIEW / EDIT */}
            <button
          onClick={() => navigate(`/albums/${album.id}`)}
          className="bg-green-500 hover:bg-green-600 p-3 rounded-full text-white"
          title="View / Edit Album"
        >
              <Pencil size={18} />
            </button>

            {/* DELETE */}
            <button
              onClick={() => onDelete(album)}
              className="bg-red-600 hover:bg-red-700 p-3 rounded-full text-white"
              title="Delete Album"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* TITLE */}
      {/* <div className="p-3 "> */}
      <div
      className={`p-5  ${
        darkMode
          ? "bg-[#BDD63B] text-black"
          : "bg-[#263248] text-white"
      }`}
    >
        <h3 className="font-semibold truncate">{album.title}</h3>
        <p className="truncate">{album.description}</p>
      </div>
    </div>
  );
}
