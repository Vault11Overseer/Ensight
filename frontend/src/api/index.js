// frontend/src/api/index.js
import axios from "axios";

export const healthCheck = async () => {
  const res = await axios.get("https://insight-backend-vu35.onrender.com//health");
  return res.data; // expected { status: "OK", db: "Connected" }
};
