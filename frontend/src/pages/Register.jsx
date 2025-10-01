import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await API.post("/auth/register", { 
      first_name: firstName,
      last_name: lastName,
      email,
      password
    });
    alert("Registered successfully");
    navigate("/login");
  } catch (err) {
    alert(err.response?.data?.detail || "Registration failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D2B3A]">
      <div className="flex w-[900px] max-w-full bg-[#1E1C29] rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
            alt="cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-5 left-5 text-white font-bold text-lg">AMU</div>
          <button className="absolute top-5 right-5 bg-white/20 text-white px-4 py-1 rounded-full text-sm hover:bg-white/30">
            Back to website →
          </button>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-lg">
            Capturing Moments, <br /> Creating Memories
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-white/40"></span>
            <span className="w-2 h-2 rounded-full bg-white/40"></span>
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:underline">Log in</a>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className="flex items-center text-gray-400 text-sm">
              <input type="checkbox" className="mr-2 accent-indigo-500" />
              I agree to the{" "}
              <a href="#" className="ml-1 text-indigo-400 hover:underline">Terms & Conditions</a>
            </label>

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 transition text-white font-medium p-3 rounded-lg"
            >
              Create account
            </button>

            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-600" />
              <span className="text-gray-400 text-sm">Or register with</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            <div className="flex gap-4">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg p-3 hover:bg-gray-100">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg p-3 hover:bg-gray-100">
                <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" alt="Apple" className="w-5 h-5" />
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
