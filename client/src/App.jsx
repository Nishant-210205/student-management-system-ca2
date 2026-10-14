import { useEffect, useState } from "react";
import axios from "axios";

import {
  Search,
  Bell,
  ChevronDown,
  Users,
  UserCheck,
  BookOpen,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import StudentDirectory from "./components/StudentDirectory";
import StudentForm from "./components/StudentForm";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/students";

function App() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [topSearch, setTopSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setStudents(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to load students:", err);

      setError(
        "Unable to connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (student) => {
    setStudents((currentStudents) => [
      ...currentStudents,
      student,
    ]);

    setError("");
  };

  const handleStudentDeleted = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) =>
            student._id !== id &&
            student.id !== id &&
            student.studentId !== id
        )
      );

      setError("");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Unable to delete the student.");
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) => {
        const studentId =
          student._id ||
          student.id ||
          student.studentId;

        const updatedId =
          updatedStudent._id ||
          updatedStudent.id ||
          updatedStudent.studentId;

        return studentId === updatedId
          ? updatedStudent
          : student;
      })
    );

    setEditingStudent(null);
    setError("");
  };

  const handleCloseForm = () => {
    setShowStudentForm(false);
    setEditingStudent(null);
  };

  const totalStudents = students.length;
  const activeStudents = students.length;

  const courses = new Set(
    students
      .map((student) => student.course)
      .filter(Boolean)
  ).size;

  const newThisMonth = students.length;

  const currentDate = new Date();

  const formattedDate =
    currentDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleTopSearch = (e) => {
    setTopSearch(e.target.value);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <header className="topbar">
          <div className="top-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search students by name, ID or course..."
              value={topSearch}
              onChange={handleTopSearch}
            />

            <div className="shortcut">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>

          <div className="topbar-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="topbar-divider"></div>

            <div className="date-section">
              <strong>{formattedDate}</strong>
              <span>Good morning, Nishant</span>
            </div>

            <div className="profile-section">
              <div className="profile-avatar">N</div>
              <ChevronDown size={17} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="welcome-section">
            <div className="welcome-text">

              <h1>
                Welcome back, Nishant
                <span className="wave">👋</span>
              </h1>


              <p>
                Here's what's happening with your students today.
              </p>
            </div>

            <button
              className="add-student-btn"
              onClick={() => {
                setEditingStudent(null);
                setShowStudentForm(true);
              }}
            >
              <UserRoundPlus size={19} />
              Add Student
            </button>
          </section>

          {error && (
            <div className="app-error">
              {error}
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              icon={<Users size={23} />}
              title="Total Students"
              value={loading ? "..." : totalStudents}
              subtitle="↑ Student records"
              variant="pink"
            />

            <StatCard
              icon={<UserCheck size={23} />}
              title="Active Students"
              value={loading ? "..." : activeStudents}
              subtitle="↑ Currently enrolled"
              variant="gold"
            />

            <StatCard
              icon={<BookOpen size={23} />}
              title="Courses"
              value={loading ? "..." : courses}
              subtitle="CSE · ECE · EEE · DS"
              variant="gold"
            />

            <StatCard
              icon={<UserPlus size={23} />}
              title="New This Month"
              value={loading ? "..." : newThisMonth}
              subtitle="↑ Recently added"
              variant="pink"
            />
          </section>

          <StudentDirectory
            students={students}
            onStudentDeleted={handleStudentDeleted}
            onEditStudent={handleEditStudent}
          />
        </main>

        {showStudentForm && (
          <StudentForm
            onClose={handleCloseForm}
            onStudentAdded={handleStudentAdded}
            editingStudent={editingStudent}
            onStudentUpdated={handleStudentUpdated}
          />
        )}
      </div>
    </div>
  );
}

export default App;