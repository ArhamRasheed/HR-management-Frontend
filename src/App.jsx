import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";
import About from "../pages/About";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    fetch("http://localhost:8000/api/check-session/", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to dashboard if authenticated */}
        <Route
          path="/login"
          element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={`/dashboard/`} />}
        />
        <Route
          path="/dashboard/"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/contact"
          element={user ? <Contact user={user} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/about"
          element={user ? <About user={user} /> : <Navigate to="/login" />}
        />
        {/* Default route */}
        <Route path="*" element={<Navigate to={user ? `/dashboard/` : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
