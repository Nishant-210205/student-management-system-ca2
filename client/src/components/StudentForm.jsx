import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/students";

function StudentForm({
  onClose,
  onStudentAdded,
  editingStudent = null,
  onStudentUpdated,
}) {
  const [student, setStudent] = useState(
    editingStudent || {
      studentId: "",
      name: "",
      email: "",
      phone: "",
      course: "",
      year: "",
    }
  );

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !student.studentId ||
      !student.name ||
      !student.email ||
      !student.phone ||
      !student.course ||
      !student.year
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (editingStudent) {
        const id =
          editingStudent._id ||
          editingStudent.id ||
          editingStudent.studentId;

        const response = await axios.put(
          `${API_URL}/${id}`,
          student
        );

        if (onStudentUpdated) {
          onStudentUpdated(response.data);
        }
      } else {
        const response = await axios.post(
          API_URL,
          student
        );

        if (onStudentAdded) {
          onStudentAdded(response.data);
        }
      }

      onClose();
    } catch (err) {
      console.error("Student save error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save student. Please check the backend."
      );
    }
  };

  return (
    <div className="form-overlay">
      <div className="student-form-card">
        <div className="form-header">
          <div>
            <span className="form-eyebrow">
              {editingStudent ? "UPDATE RECORD" : "NEW RECORD"}
            </span>

            <h2>
              {editingStudent
                ? "Edit Student"
                : "Add New Student"}
            </h2>

            <p>
              {editingStudent
                ? "Update the student's information."
                : "Enter the student's details below."}
            </p>
          </div>

          <button
            type="button"
            className="form-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Student ID</label>

              <input
                type="text"
                name="studentId"
                placeholder="e.g. STU006"
                value={student.studentId}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={student.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={student.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={student.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Course</label>

              <select
                name="course"
                value={student.course}
                onChange={handleChange}
              >
                <option value="">Select course</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="DS">DS</option>
              </select>
            </div>

            <div className="form-field">
              <label>Year</label>

              <select
                name="year"
                value={student.year}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-student-btn"
            >
              <UserPlus size={18} />

              {editingStudent
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;