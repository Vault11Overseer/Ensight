# ======================================

# ENSIGHT - FRONTEND

# ======================================

<!-- WHEN CLONING DON'T FORGET TO RUN: -->
  npm init

<!-- RUN THE FRONTEND: -->
  npm run dev




  {/* PROTECTED PAGES */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />


          

<!-- OLD PACKAGE.JSON -->
  <!-- "dependencies": {
    "axios": "^1.4.0",
    "lucide-react": "^0.544.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.0.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "vite": "^4.0.0"
  } -->


<!-- POST CSS -->
<!-- postcss.config.js -->
<!-- module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} -->


<!-- TAILWINDS -->
<!-- tailwind.config.js -->
<!-- /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // adjust to match your file structure
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} -->
