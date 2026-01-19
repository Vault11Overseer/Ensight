import React from "react";
import { useParams } from "react-router-dom";

export default function AlbumView() {
  const { albumId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Album View</h1>
      <p className="opacity-70 mt-2">
        Album ID: {albumId}
      </p>

      {/* Image management + metadata comes next */}
    </div>
  );
}
