import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminunitPage.css"; // Import the CSS file for styling


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
    fetch("http://localhost:5000/course")
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
                  <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/admin-course-selection" >Course</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active">Units</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">Topics</a>
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
      <footer className="p-3 mt-5 text-white">
        <div className="row">
          <div className="col-12 col-lg-6 pt-1">
            <p className="mb-0 pt-2 text-center">
              &copy; 2023 Sathyabama Institute of Science and Technology. All
              rights reserved.
            </p>
          </div>
          <div className="col-12 col-lg-6 pt-1 d-flex justify-content-start justify-content-lg-end">
            <ul className="list-inline col-12 col-lg-6">
              <li className="list-inline-item">
                <a className="text-white text-decoration-none" href="">
                  Privacy Policy
                </a>
              </li>
              <li className="list-inline-item">
                <a className="text-white text-decoration-none" href="">
                  Terms and Condition
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default AdminunitPage;