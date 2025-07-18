import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GetStartedPage.module.css'; // Ensure styles are imported

const GetStartedPage = () => {
  const [role, setRole] = useState('student');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    localStorage.setItem("role", e.target.value); // ✅ fix: store selected value
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const handleClick = () => {
    navigate('/student-course-selection');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show loader

    fetch('https://project-setup-vcdb.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); // ✅ Hide loader

        if (data.message === 'Login successful') {
          localStorage.setItem('role', role);

          if (role === 'admin') {
            navigate('/admin-course-selection');
          }
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        setLoading(false); // ✅ Hide loader
        alert('Error: ' + error.message);
      });
  };

  return (
    <div className={styles.total}>
      <div className={styles.getstartedcontainer}>
        <img className={styles.logo} alt="Logo" />
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

      {/* ✅ Loader Overlay */}
      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
          <p style={{ color: 'white', marginTop: '10px' }}>Logging in...</p>
        </div>
      )}
    </div>
  );
};

export default GetStartedPage;
