// Import required packages
// Import required packages 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config(); // To load environment variables

const app = express();
const PORT = process.env.PORT || 5000;


// MongoDB URI from environment variables
const dbURI = 'mongodb+srv://igris6302:GkuJ8cVKfhRu9rZa@cluster0.jcwgt.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.use(express.json());
app.use(cors());

// Schema for Admin, Student, and Courses
const adminSchema = new mongoose.Schema({
    username: String,
    password: String, // Added password field for admin login
    role: { type: String, default: 'admin' }
});

const studentSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'student' } // Default role is student
});

const courseSchema = new mongoose.Schema({
    regulation: String,
    yearsOfStudy: [
        {
            year: String,
            semesters: [
                {
                    semester: String,
                    courses: [
                        {
                            course: String,
                            units: [
                                {
                                    unitNumber: Number,
                                    unitTitle: String,
                                    topics: [
                                        {
                                            topicName: String,
                                            youtubeLink: String,
                                            notesLink: String
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

// Create models
const Admin = mongoose.model('Admin', adminSchema);
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);

// Route to create admin
app.post('/create-admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create student
app.post('/create-student', async (req, res) => {
  const { username, password } = req.body;
  try {
    const studentExists = await Student.findOne({ username });
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ username, password: hashedPassword, role: 'student' });
    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route for Admin and Student
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the user is an admin or student
    const admin = await Admin.findOne({ username });
    const student = await Student.findOne({ username });

    let user = admin || student;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      role: user.role
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all courses
app.get('/course', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add a topic to a specific unit
app.post('/add-topic', async (req, res) => {
  const { regulation, year, semester, course, unitNumber, topicName, youtubeLink, notesLink } = req.body;

  if (!regulation || !year || !semester || !course || !unitNumber || !topicName || !youtubeLink || !notesLink) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const courseData = await Course.findOne({ regulation });
    if (!courseData) {
      return res.status(404).json({ message: 'Regulation not found' });
    }

    const selectedYear = courseData.yearsOfStudy.find(y => y.year === year);
    if (!selectedYear) {
      return res.status(404).json({ message: 'Year not found' });
    }

    const selectedSemester = selectedYear.semesters.find(s => s.semester === semester);
    if (!selectedSemester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const selectedCourse = selectedSemester.courses.find(c => c.course === course);
    if (!selectedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const selectedUnit = selectedCourse.units.find(u => u.unitNumber === unitNumber);
    if (!selectedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    selectedUnit.topics.push({ topicName, youtubeLink, notesLink });
    await courseData.save();
    res.status(200).json({ message: 'Topic added successfully' });
  } catch (err) {
    console.error('Error adding topic:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a topic from a specific unit
app.delete('/delete-topic', async (req, res) => {
  const { regulation, year, semester, course, unitNumber, topicName } = req.body;

  if (!regulation || !year || !semester || !course || !unitNumber || !topicName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const courseData = await Course.findOne({ regulation });
    if (!courseData) {
      return res.status(404).json({ message: 'Regulation not found' });
    }

    const selectedYear = courseData.yearsOfStudy.find(y => y.year === year);
    if (!selectedYear) {
      return res.status(404).json({ message: 'Year not found' });
    }

    const selectedSemester = selectedYear.semesters.find(s => s.semester === semester);
    if (!selectedSemester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const selectedCourse = selectedSemester.courses.find(c => c.course === course);
    if (!selectedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const selectedUnit = selectedCourse.units.find(u => u.unitNumber === unitNumber);
    if (!selectedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const topicIndex = selectedUnit.topics.findIndex(topic => topic.topicName === topicName);
    if (topicIndex === -1) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    selectedUnit.topics.splice(topicIndex, 1);
    await courseData.save();
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (err) {
    console.error('Error deleting topic:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add a new unit to a course
app.post('/add-unit', async (req, res) => {
  const { regulation, year, semester, course, unitNumber, unitTitle } = req.body;

  if (!regulation || !year || !semester || !course || !unitNumber || !unitTitle) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const courseData = await Course.findOne({ regulation });
    if (!courseData) {
      return res.status(404).json({ message: 'Regulation not found' });
    }

    const selectedYear = courseData.yearsOfStudy.find(y => y.year === year);
    if (!selectedYear) {
      return res.status(404).json({ message: 'Year not found' });
    }

    const selectedSemester = selectedYear.semesters.find(s => s.semester === semester);
    if (!selectedSemester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const selectedCourse = selectedSemester.courses.find(c => c.course === course);
    if (!selectedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    selectedCourse.units.push({ unitNumber, unitTitle, topics: [] });
    await courseData.save();
    res.status(200).json({ message: 'Unit added successfully' });
  } catch (err) {
    console.error('Error adding unit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
