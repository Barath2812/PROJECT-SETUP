import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HashRouter as Router } from 'react-router-dom';
import GetStartedPage from "./GetStartedPage.jsx";
import AdminCourseSelection from "./AdminCourseSelection.jsx";
import AdminUnitPage from "./Adminunit.jsx";
import StudentCourseSelection from "./StudentCourseSelection.jsx";
import StudentUnitPage from "./Studentunit.jsx";
import TopicPage from "./TOPIC.jsx"; // TopicPage for both admin and student

const App = () => {
  const [role, setRole] = useState(null);

  // Load role from localStorage when the app starts
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole); // Update the role state based on the saved role
  }, []);

  const PrivateRoute = ({ children, requiredRole }) => {
    if (!role) {
      // If the user is not logged in (no role stored), redirect to the home page
      return <Navigate to="/" />;
    }
    if (requiredRole && role !== requiredRole) {
      // If the role doesn't match the required role, redirect to the home page
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Route for the landing page */}
        <Route path="/" element={<GetStartedPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin-course-selection"
          element={
           
              <AdminCourseSelection requiredRole="admin"/>
           
          }
        />
        <Route
          path="/admin-unit"
          element={
              <AdminUnitPage requiredRole="admin" />
          }
        />
        <Route
          path="/admin-topic"
          element={
            
              <TopicPage  userRole={localStorage.getItem("role")} />
           
          }
        />

        {/* Student Routes */}
        <Route
          path="/student-course-selection"
          element={
              <StudentCourseSelection />
          }
        />
        <Route
          path="/student-unit"
          element={
            
              <StudentUnitPage />
            
          }
        />
        <Route
          path="/student-topic"
          element={
            
              <TopicPage />
            
          }
        />

        {/* Redirect for unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

