import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GetStartedPage.module.css'; // Ensure to import styles for the design

const GetStartedPage = () => {
  const [role, setRole] = useState('student');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // Handle the role change and toggle admin login form visibility
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    localStorage.setItem("role", role);
  };

  // Handle input changes for username and password
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const handleClick = (e) => {
    navigate('/student-course-selection')
  };
  

  // Handle login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          // Save role to localStorage after successful login
          localStorage.setItem('role', role);

          // Redirect based on role after successful login
          if (role === 'admin') {
            navigate('/admin-course-selection');
          }
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  };

  return (
    <div className={styles.total}>
      <div className={styles.getstartedcontainer}>
        <img className={styles.logo} />
        <h3>SATHYABAMA</h3>
        <h5>DEPT OF INFORMATION TECHNOLOGY</h5>
        <h6>Click Here To Get Started Learning</h6>

        <div className={styles.getstarteddropdown}>
          <label htmlFor="role">Select Role:</label>
          <select id="role" value={role} onChange={handleRoleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Admin Login Form */}
        {role === 'admin' && (
          <div className={styles.adminLogin}>
            <h3>Admin Login</h3>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={loginData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className={styles.getStartedButton}>
                Login
              </button>
            </form>
          </div>
        )}

        {/* Student Get Started Button */}
        {role === 'student' && (
          <button
            className={styles.getStartedButton}
            onClick={handleClick}
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default GetStartedPage;
