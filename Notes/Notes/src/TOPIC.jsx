import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./topic.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";

const TopicPage = ({ userRole }) => {
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [notesLink, setNotesLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'https://project-setup-vcdb.onrender.com';
  const courseData = JSON.parse(sessionStorage.getItem("courseData"));
  const { regulation, yearOfStudy: year, semester, course, unitNumber } = courseData || {};

  const fetchTopics = useCallback(async () => {
    // Fetching logic remains the same
  }, [regulation, year, semester, course, unitNumber, courseData]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const addTopic = async () => {
    // Adding topic logic remains the same
  };

  const deleteTopic = async (topicName) => {
    // Deleting topic logic remains the same
  };

  return (
    <div className="col-12 bg-light">
      <header className="fixed-top">
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
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to={userRole === 'admin' ? "/admin-course-selection" : "/student-course-selection"}>Course</Link></li>
                <li className="nav-item"><Link className="nav-link" to={userRole === 'admin' ? "/admin-unit" : "/student-unit"}>Units</Link></li>
                <li className="nav-item"><Link className="nav-link active" to="#">Topics</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div className="topic-container">
              {userRole === 'admin' && (
                <div className="syllabus-container">
                  <div className="syllabus-card text-center">
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
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="mt-4">
              <h4 className='mb-4'>{`${regulation} | ${year} | ${semester} | ${course} | Unit: ${unitNumber} Topics`}</h4>
              {topics.length > 0 ? (
                <div className="row">
                  {topics.map((topic, index) => (
                    <div className="col-md-4 col-sm-6 mb-3" key={index}>
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
          </div>
        </div>
      </main>
      <footer className="text-white text-center py-3">
        <p>&copy; 2023 SATHYABAMA University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TopicPage;
