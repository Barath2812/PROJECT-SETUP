import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminunitPage.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";

const TopicPage = ({ userRole }) => {
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [notesLink, setNotesLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Base API URL
  const API_BASE_URL = 'https://project-setup-vcdb.onrender.com';

  // Retrieve course data from sessionStorage
  const courseData = JSON.parse(sessionStorage.getItem("courseData"));
  const { regulation, yearOfStudy: year, semester, course, unitNumber } = courseData || {};

  // Fetch topics for the current unit
  const fetchTopics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course`);
      const courses = response.data;

      if (!courseData) {
        console.error('No course data found');
        return;
      }

      // Find the current unit based on courseData
      const currentRegulation = courses.find(c => c.regulation === regulation);
      if (!currentRegulation) {
        console.error('Regulation not found');
        return;
      }

      const currentYear = currentRegulation.yearsOfStudy.find(y => y.year === year);
      if (!currentYear) {
        console.error('Year not found');
        return;
      }

      const currentSemester = currentYear.semesters.find(s => s.semester === semester);
      if (!currentSemester) {
        console.error('Semester not found');
        return;
      }

      const currentCourse = currentSemester.courses.find(c => c.course === course);
      if (!currentCourse) {
        console.error('Course not found');
        return;
      }

      const currentUnit = currentCourse.units.find(u => u.unitNumber === unitNumber);
      if (!currentUnit) {
        console.error('Unit not found');
        return;
      }

      // Set topics for the current unit
      setTopics(currentUnit.topics || []);

    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  }, [regulation, year, semester, course, unitNumber, courseData]);

  // Fetch topics on component load
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Add a topic to MongoDB
  const addTopic = async () => {
    if (!topicName || !notesLink || !youtubeLink) {
      setError('All fields are required.');
      return;
    }
    if (!notesLink.startsWith('http') || !youtubeLink.startsWith('http')) {
      setError('Please provide valid URLs.');
      return;
    }

    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/add-topic`, {
        regulation,
        year,
        semester,
        course,
        unitNumber,
        topicName,
        youtubeLink,
        notesLink,
      });

      setSuccess(response.data.message);
      // Refresh the topics list
      await fetchTopics();
      // Clear input fields
      setTopicName('');
      setNotesLink('');
      setYoutubeLink('');
    } catch (err) {
      console.error('Error adding topic:', err);
      setError('Failed to add topic. Please try again.');
    }
  };

  const deleteTopic = async (topicName) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-topic`, {
        data: {
          regulation,
          year,
          semester,
          course,
          unitNumber,
          topicName,
        },
      });

      setSuccess(response.data.message);
      // Refresh the topics list
      await fetchTopics();
    } catch (err) {
      console.error('Error deleting topic:', err);
      setError('Failed to delete topic. Please try again.');
    }
  };

  return (
    <div className="col-12 bg-light ">
      <header className="sticky-top">
        <nav className="navbar navbar-dark navbar-expand-lg">
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
                <li className="nav-item"><Link className="nav-link" to="https://project-setup-1.onrender.com/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to={userRole === 'admin' ? "/admin-course-selection" : "/student-course-selection"}>Course</Link></li>
                <li className="nav-item"><Link className="nav-link" to={userRole === 'admin' ? "/admin-unit" : "/student-unit"}>Units</Link></li>
                <li className="nav-item"><Link className="nav-link active" to="#">Topics</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container flex-grow-1 mt-5 pt-5 min-vh-100">
        {/* Replace the h2 with the h4 displaying course information */}
      
        {userRole === 'admin' && (
          <div className="syllabus-container ">
            <div className="syllabus-card text-center ">
              <h4>Add a Topic</h4>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <input type="text" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" className="form-control mb-2" />
              <input type="text" value={notesLink} onChange={(e) => setNotesLink(e.target.value)} placeholder="Notes Drive Link" className="form-control mb-2" />
              <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="YouTube Link" className="form-control mb-2" />
              <button onClick={addTopic} className="btn btn-success">Add Topic</button>
            </div>
          </div>
        )}

  
        <div className="mt-4">
        <h4 className='mb-4'>{`${regulation} | ${year} | ${semester} | ${course} | Unit: ${unitNumber} Topics`}</h4>
          
          {topics.length > 0 ? (
            <div className="row">
              {topics.map((topic, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{topic.topicName}</h5>
                      {topic.notesLink && (
                        <a href={topic.notesLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">Notes</a>
                      )}
                      {topic.youtubeLink && (
                        <a href={topic.youtubeLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary me-2">YouTube</a>
                      )}
                      {userRole === 'admin' && (
                        <button onClick={() => deleteTopic(topic.topicName)} className="btn btn-danger">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No topics added yet.</p>
          )}
        </div>
      </main>

      <footer className="text-white text-center py-3">
        <p>&copy; 2023 SATHYABAMA University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TopicPage;
