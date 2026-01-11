// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler']],
//       },
//     }),
//   ],
// })



// src/api.js
export const API_BASE = "https://insight-backend-vu35.onrender.com";

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}
