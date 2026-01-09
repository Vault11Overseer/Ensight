// frontend/src/pages/auth/Settings.jsx

// =========================
// SETTINGS PAGE
// =========================

// =========================
// IMPORTS
// =========================
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Header from "../../components/module/Header";

// =========================
// SETTING FUNCTION
// =========================
export default function Settings() {
  const { user, logout } = useAuth();

  // =========================
  // DARK MODE
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // =========================
  // PASSWORD UPDATE LOGIC
  // =========================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await API.put("/users/update_password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Failed to update password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETURN
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER with theme toggle and back button */}
      <Header
        introProps={{ user }}
        navigationProps={{ logout, darkMode, toggleDarkMode }}
        back="/Dashboard"
      />

      {/* SETTINGS CARD */}
      <div
        className={`w-full max-w-2xl shadow-xl rounded-2xl p-8 border mx-auto ${
          darkMode
            ? "bg-[#1F1F1F] border-gray-800"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          User Settings
        </h1>

        {/* USER INFO */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">User ID:</span>
            <span>{user?.id || "Unknown"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Name:</span>
            <span>
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : "Unknown"}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Email:</span>
            <span>{user?.email || "Unknown"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Account Created:</span>
            <span>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* PASSWORD UPDATE FORM */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Password
        </h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-2xl bg-[#262626] border border-gray-700 text-white focus:ring-2 focus:ring-[#BDD63B] focus:outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-2xl bg-[#262626] border border-gray-700 text-white focus:ring-2 focus:ring-[#BDD63B] focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-2xl bg-[#262626] border border-gray-700 text-white focus:ring-2 focus:ring-[#BDD63B] focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <div
              className={`text-center text-sm ${
                message.includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BDD63B] hover:bg-[#a4c12d] transition-colors text-black font-semibold py-2 rounded-2xl shadow-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
