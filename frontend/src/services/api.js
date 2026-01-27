// frontend/src/services/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// =========================
// HELPER: Get auth token from localStorage
// =========================
function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // For now, we'll use a simple approach - you may need to adjust based on your auth setup
  return {
    "Content-Type": "application/json",
  };
}

// =========================
// HEALTH CHECK
// =========================
export const healthCheck = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ HEALTH CHECK ERROR:", err);
    return { status: "error", error: err.message };
  }
};

// =========================
// AUTH
// =========================
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

// =========================
// GALLERY
// =========================
export const getGallery = async (skip = 0, limit = 100, search = null) => {
  const params = new URLSearchParams({ skip, limit });
  if (search) params.append("search", search);
  
  const res = await fetch(`${API_BASE_URL}/gallery?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
};

// =========================
// IMAGES
// =========================
export const getImages = async (skip = 0, limit = 100) => {
  const params = new URLSearchParams({ skip, limit });
  const res = await fetch(`${API_BASE_URL}/images?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json();
};

export const getImage = async (imageId) => {
  const res = await fetch(`${API_BASE_URL}/images/${imageId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch image");
  return res.json();
};

export const uploadImage = async (file, title, description, albumIds = [], userTags = []) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  if (description) formData.append("description", description);
  if (albumIds.length > 0) formData.append("album_ids", albumIds.join(","));
  if (userTags.length > 0) formData.append("user_tags", userTags.join(","));

  const res = await fetch(`${API_BASE_URL}/images/`, {
    method: "POST",
    // Multipart/form-data; let the browser set Content-Type and boundary
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to upload image");
  }
  return res.json();
};

export const updateImage = async (imageId, data) => {
  const res = await fetch(`${API_BASE_URL}/images/${imageId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update image");
  return res.json();
};

export const deleteImage = async (imageId) => {
  const res = await fetch(`${API_BASE_URL}/images/${imageId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete image");
  return res.json();
};

export const addImageToAlbum = async (imageId, albumId) => {
  const res = await fetch(`${API_BASE_URL}/images/${imageId}/albums/${albumId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to add image to album");
  return res.json();
};

export const removeImageFromAlbum = async (imageId, albumId) => {
  const res = await fetch(`${API_BASE_URL}/images/${imageId}/albums/${albumId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove image from album");
  return res.json();
};

// =========================
// ALBUMS
// =========================
export const getAlbums = async () => {
  const res = await fetch(`${API_BASE_URL}/albums/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
};

export const getAlbum = async (albumId) => {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
};

export const getAlbumImages = async (albumId) => {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}/images`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch album images");
  return res.json();
};

export const createAlbum = async (title, description = null) => {
  const res = await fetch(`${API_BASE_URL}/albums/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
};

export const updateAlbum = async (albumId, data) => {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
};

export const deleteAlbum = async (albumId) => {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete album");
  return res.json();
};

// =========================
// FAVORITES
// =========================
export const getFavorites = async () => {
  const res = await fetch(`${API_BASE_URL}/favorites/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
};

export const addFavorite = async (imageId) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${imageId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
};

export const removeFavorite = async (imageId) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${imageId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
};

export const checkFavorite = async (imageId) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${imageId}/check`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to check favorite");
  return res.json();
};

// =========================
// SHARE LINKS
// =========================
export const createShareLink = async (resourceType, resourceId, expiresAt = null) => {
  const res = await fetch(`${API_BASE_URL}/share-links/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ resource_type: resourceType, resource_id: resourceId, expires_at: expiresAt }),
  });
  if (!res.ok) throw new Error("Failed to create share link");
  return res.json();
};

export const getShareLink = async (token) => {
  const res = await fetch(`${API_BASE_URL}/share-links/token/${token}`);
  if (!res.ok) throw new Error("Failed to fetch share link");
  return res.json();
};

export const deleteShareLink = async (linkId) => {
  const res = await fetch(`${API_BASE_URL}/share-links/${linkId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete share link");
  return res.json();
};
