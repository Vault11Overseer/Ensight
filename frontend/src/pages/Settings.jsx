// frontend/src/pages/Settings.jsx

import React, { useState, useEffect } from "react";
import Header from "../components/module/Header";
import { useUserData } from "../services/UserDataContext";

export default function Settings() {
  const { darkMode, setDarkMode, user, setUser } = useUserData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleProfileUpdate = async () => {
    setMessage("");

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handlePasswordUpdate = async () => {
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Password update failed");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <Header
        navigationProps={{
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      <div className="max-w-3xl mx-auto space-y-10 mt-10">

        {/* PROFILE SETTINGS */}
        <div
          className={`p-6 rounded-2xl shadow ${
            darkMode ? "bg-[#BDD63B] text-black" : "bg-[#263248] text-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleProfileUpdate}
              className="w-full p-3 rounded font-semibold bg-black text-white hover:opacity-90"
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* PASSWORD SETTINGS */}
        <div
          className={`p-6 rounded-2xl shadow ${
            darkMode ? "bg-[#BDD63B] text-black" : "bg-[#263248] text-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-3 rounded text-black"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 rounded text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handlePasswordUpdate}
              className="w-full p-3 rounded font-semibold bg-black text-white hover:opacity-90"
            >
              Update Password
            </button>
          </div>
        </div>

        {message && (
          <p className="text-center font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
