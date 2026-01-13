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
