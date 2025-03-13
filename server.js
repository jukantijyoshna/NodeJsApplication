require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = "mongodb://localhost:27017/mern";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to Local MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define the student schema using RollNo as a unique identifier
const studentSchema = new mongoose.Schema(
  {
    RollNo: { type: String, required: true, unique: true },
    EmailID: { type: String, required: true },
    Name: { type: String, required: true }
  },
  { collection: "student" }
);

// Model name "Student" – it will use the "student" collection (as defined above)
const Student = mongoose.model("Student", studentSchema);

// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET a single student by RollNo
app.get("/students/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ RollNo: req.params.rollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
});

// POST a new student
app.post("/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding student", error: error.message });
  }
});

// PUT update a student by RollNo
app.put("/students/:rollNo", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { RollNo: req.params.rollNo },
      req.body,
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
});

// DELETE a student by RollNo
app.delete("/students/:rollNo", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ RollNo: req.params.rollNo });
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
