import { useEffect, useState } from "react";
import { healthCheck } from "./api";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    healthCheck().then(data => setStatus(data.status)).catch(() => setStatus("Error"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Insight Frontend</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
