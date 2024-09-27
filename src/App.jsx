import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import './App.css';
import AuthLayout from './Components/AuthLayout';
import Dashboard from './Components/Dashboard';
import Signup from './Components/Login&Signup/Signup';
import Forgetpass from './Components/Login&Signup/Forgetpass';
import Login from './Components/Login&Signup/Login';
import Otp from './Components/Login&Signup/Otp';
import Passchange from './Components/Login&Signup/Passchange';
import Header from './Components/Header';
import Leads from './Components/MyLeads';
import MyLeads from './Components/MyLeads';
import Paymentdetails from './Components/Paymentdetails';
import Earnings from './Components/Earnings';
import Trainings from './Components/Trainings';
import Mydocument from './Components/Mydocument';

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
          <Route path="/password/reset/Otp" element={<Otp/>} />
          <Route path="/password/reset/Passchange" element={<Passchange/>} />

          {/* Protected Route */}
          <Route path="/" element={<AuthLayout><Header title="Dashboard"><Dashboard /></Header></AuthLayout>} />
          <Route path="/leads" element={<AuthLayout><Header title="My Leads"><MyLeads/></Header></AuthLayout>} />
          <Route path="/team" element={<AuthLayout><Header title="My Team"></Header></AuthLayout>} />
          <Route path="/paymentdetail" element={<AuthLayout><Header title="Payment Detail"><Paymentdetails/></Header></AuthLayout>} />
          <Route path="/earning" element={<AuthLayout><Header title="My Earning"><Earnings/></Header></AuthLayout>} />
          <Route path="/documents" element={<AuthLayout><Header title="My Documents"><Mydocument/></Header></AuthLayout>} />
          <Route path="/training" element={<AuthLayout><Header title="Training"><Trainings/></Header></AuthLayout>} />
          <Route path="/my-level" element={<AuthLayout><Header title="My Level"></Header></AuthLayout>} />
          <Route path="/my-website" element={<AuthLayout><Header title="My Website"></Header></AuthLayout>} />
          <Route path="/language" element={<AuthLayout><Header  title="Language"></Header></AuthLayout>} />
          <Route path="/support" element={<AuthLayout><Header title="Support"></Header></AuthLayout>} />
          <Route path="/terms" element={<AuthLayout><Header title="Terms & Conditions"></Header></AuthLayout>} />
          <Route path="/settings" element={<AuthLayout><Header title="Setting"></Header></AuthLayout>} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
