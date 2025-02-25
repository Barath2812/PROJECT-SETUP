import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminunitPage.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";

const AdminunitPage = () => {
  const [courseData, setCourseData] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Get course data from session storage
    const storedCourseData = JSON.parse(sessionStorage.getItem("courseData"));
    if (!storedCourseData) {
      navigate("./AdminCourseSelection"); // Redirect if no course data
      return;
    }
    setCourseData(storedCourseData);

    // Fetch course data from server
    fetch("https://project-setup-vcdb.onrender.com/course")
      .then((response) => response.json())
      .then((data) => {
        const { regulation, yearOfStudy, semester, course } = storedCourseData;

        // Find the selected regulation
        const selectedRegulation = data.find(
          (item) => item.regulation === regulation
        );
        if (selectedRegulation) {
          // Find the selected year of study
          const selectedYear = selectedRegulation.yearsOfStudy.find(
            (y) => y.year === yearOfStudy
          );
          if (selectedYear) {
            // Find the selected semester
            const selectedSemester = selectedYear.semesters.find(
              (s) => s.semester === semester
            );
            if (selectedSemester) {
              // Find the course within the selected semester
              const selectedCourse = selectedSemester.courses.find(
                (c) => c.course === course
              );
              if (selectedCourse && selectedCourse.units) {
                setUnits(selectedCourse.units);
              } else {
                setError("No units found for this course.");
              }
            } else {
              setError("No semester found for this course.");
            }
          } else {
            setError("No year of study found for this course.");
          }
        } else {
          setError("No regulation found for this course.");
        }
      })
      .catch((err) => {
        console.error("Error fetching course data:", err);
        setError("Failed to load units. Please try again later.");
      });
  }, [navigate]);

  if (!courseData) return null;

  const { regulation, yearOfStudy, semester, course } = courseData;

  const handleUnitSelection = (unit) => {
    // Store the selected unit number in sessionStorage
    const unitData = { regulation, yearOfStudy, semester, course, unitNumber: unit.unitNumber };
    sessionStorage.setItem("courseData", JSON.stringify(unitData));

    // Navigate to the topic page
    navigate('/admin-topic');
  };

  return (
    <div className=" col-12 bg-light d-flex flex-column min-vh-100">
      <header className="sticky-top">
        <nav className="navbar navbar-dark navbar-expand-lg navbar-expand-md navbar-expand-sm">
          <div className="container">
            <h1 className="navbar-brand">SATHYABAMA</h1>
            <button4
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button4>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-course-selection" >Course</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active">Units</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link">Topics</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container flex-grow-1">
      <div className="unit-container ">
        <div className="unit-card text-center ">
          <h4>{`${regulation} | ${yearOfStudy} | ${semester} | ${course}`}</h4>
          {error ? (
            <p>{error}</p>
          ) : (
            units.map((unit, index) => (
              <button 
                key={index}
                className="button unit-button m-2"
                onClick={() => handleUnitSelection(unit)} // Call the selection handler
              >
                {unit.unitTitle}
              </button>
            ))
          )}
        </div>
      </div>
      
      </main>
     <footer className="text-white text-center py-3">
        <p>&copy; 2023 SATHYABAMA University. All rights reserved.</p>
      </footer>
    </div>

  );
};

export default AdminunitPage;
