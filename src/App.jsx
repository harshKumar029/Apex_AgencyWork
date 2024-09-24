import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import './App.css';
import AuthLayout from './Components/AuthLayout';
import Dashboard from './Components/Dashboard';
import Signup from './Components/Login&Signup/Signup';
import Forgetpass from './Components/Login&Signup/Forgetpass';
import Login from './Components/Login&Signup/Login';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <Router> {/* Wrap everything inside Router */}
      {isLoading ? (
        <div className="bg-light-dasboard-gray h-screen flex justify-center items-center">
          {/* Optional: Replace with a loading spinner component */}
          <p>Loading......</p>
        </div>
      ) : (
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password/reset" element={<Forgetpass />} />
          {/* Protected Route */}
          <Route path="/" element={<AuthLayout><Dashboard /></AuthLayout>} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
