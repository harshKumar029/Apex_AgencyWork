// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import AuthLayout from './Components/AuthLayout';
import Signup from './Components/Login&Signup/Signup';
import Forgetpass from './Components/Login&Signup/Forgetpass';
import Login from './Components/Login&Signup/Login';
import Otp from './Components/Login&Signup/Otp';
import Passchange from './Components/Login&Signup/Passchange';
import Header from './Components/Header';
import MyLeads from './Components/MyLeads';
import Paymentdetails from './Components/Paymentdetails';
import Earnings from './Components/Earnings';
import Trainings from './Components/Trainings';
import Mydocument from './Components/Mydocument';
import Support from './Components/Support';
import MyLevel from './Components/MyLevel';
import Dashboard from './Components/Dashboard/Dashboard';
import SelectBankAcc from './Components/Dashboard/SelectBankAcc';
import LeadDetails from './Components/Dashboard/LeadDetails';
import ConfirmationPage from './Components/Dashboard/ConfirmationPage';
import Setting from './Components/Setting';
import Termandcondition from './Components/Termandcondition';
import SideBar from './Components/SideBar';
import HeaderSearchbar from './Components/HeaderSearchbar';
import ScrollToTop from './Components/ScrollToTop';
import BottomNavigationBar from './Components/BottomNavigationBar';
import ViewDetails from './Components/ViewDetails';
import ReferAndEarn from './Components/ReferAndEarn';

// Import ProtectedRoute
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password/reset" element={<Forgetpass />} />
        <Route path="/password/reset/Otp" element={<Otp />} />
        <Route path="/password/reset/Passchange" element={<Passchange />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Header title="Dashboard" />
                        <Dashboard />
                      </>
                    }
                  />
                  <Route
                    path="selectbank/:serviceId"
                    element={
                      <>
                        <Header title="Select Bank" />
                        <SelectBankAcc />
                      </>
                    }
                  />
                  <Route
                    path="selectbank/:serviceId/leaddetails/:bankId"
                    element={
                      <>
                        <Header title="Lead Details" />
                        <LeadDetails />
                      </>
                    }
                  />
                  <Route
                    path="selectbank/:serviceId/leaddetails/confirmation"
                    element={
                      <>
                        <Header title="Confirmation" />
                        <ConfirmationPage />
                      </>
                    }
                  />
                  {/* Add more nested dashboard routes here */}
                </Routes>
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Other Protected Routes */}
        <Route
          path="/my-leads"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="My Leads" />
                <MyLeads />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* New Route for ViewDetails */}
        <Route
          path="/view-details/:leadId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="View Details" />
                <ViewDetails />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* New Route for Refer & Earn */}
        <Route
          path="/refer-earn"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Refer & Earn" />
                <ReferAndEarn />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/paymentdetail"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Payment Detail" />
                <Paymentdetails />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/earning"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Earnings" />
                <Earnings />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Training" />
                <Trainings />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Documents" />
                <Mydocument />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Support" />
                <Support />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-level"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="My Level" />
                <MyLevel />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Settings" />
                <Setting />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <SideBar />
                <BottomNavigationBar />
                <Header title="Terms & Conditions" />
                <Termandcondition />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;