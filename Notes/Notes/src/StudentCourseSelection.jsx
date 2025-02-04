import React, { useState, useEffect } from "react";
import "./AdminunitPage.css"; // Import CSS module
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


const StudentCourseSelection = () => {
  const [data, setData] = useState([]);
  const [regulation, setRegulation] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://project-setup-vcdb.onrender.com/course");
        if (!response.ok) throw new Error("Failed to fetch course data");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to load courses. Check console for details.");
      }
    };
    fetchData();
  }, []);

  const handleRegulationChange = (e) => {
    const selectedRegulation = e.target.value;
    setRegulation(selectedRegulation);

    const regulationData = data.find((item) => item.regulation === selectedRegulation);
    setYears(regulationData ? regulationData.yearsOfStudy : []);
    setYearOfStudy("");
    setSemester("");
    setCourse("");
    setSemesters([]);
    setCourses([]);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYearOfStudy(selectedYear);

    const regulationData = data.find((item) => item.regulation === regulation);
    const yearData = regulationData?.yearsOfStudy.find((year) => year.year === selectedYear);
    setSemesters(yearData ? yearData.semesters : []);
    setSemester("");
    setCourse("");
    setCourses([]);
  };

  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setSemester(selectedSemester);

    const regulationData = data.find((item) => item.regulation === regulation);
    const yearData = regulationData?.yearsOfStudy.find((year) => year.year === yearOfStudy);
    const semesterData = yearData?.semesters.find((sem) => sem.semester === selectedSemester);
    setCourses(semesterData ? semesterData.courses : []);
    setCourse("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!regulation || !yearOfStudy || !semester || !course) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Create an object to store in sessionStorage
    const courseData = { regulation, yearOfStudy, semester, course };
    
    // Store the course data in sessionStorage
    sessionStorage.setItem("courseData", JSON.stringify(courseData));

    setErrorMessage("");
    setSuccessMessage("Course selected successfully!");
    navigate("/student-unit"); // Navigate to the next page
  };

  return (
    <div className=" col-12 bg-light d-flex flex-column min-vh-100 ">
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
                  <a className="nav-link " href="https://project-setup-vcdb.onrender.com/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active">Course</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ">Units</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">Topics</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container flex-grow-1 ">
        <div className="syllabus-container ">
          <div className="syllabus-card text-center ">
        <h2 className="text-center">Select Your Course</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Regulation</label>
            <select className="form-select" value={regulation} onChange={handleRegulationChange} required>
              <option value="">Select Regulation</option>
              {data.map((item) => (
                <option key={item.regulation} value={item.regulation}>
                  {item.regulation}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Year of Study</label>
            <select className="form-select" value={yearOfStudy} onChange={handleYearChange} required>
              <option value="">Select Year of Study</option>
              {years.map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Semester</label>
            <select className="form-select" value={semester} onChange={handleSemesterChange} required>
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semester} value={sem.semester}>
                  {sem.semester}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Course</label>
            <select className="form-select" value={course} onChange={(e) => setCourse(e.target.value)} required>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.course} value={c.course}>
                  {c.course}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          {errorMessage && <div className="mt-3 text-danger">{errorMessage}</div>}
          {successMessage && <div className="mt-3 text-success">{successMessage}</div>}
        </form>
        </div>
        </div>
      </main>
      <footer className="text-white text-center py-3">
        <p>&copy; 2023 SATHYABAMA University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentCourseSelection;
