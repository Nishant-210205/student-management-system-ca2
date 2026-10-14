import { useState } from "react";
import {
  Users,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

function StudentDirectory({
  students = [],
  onStudentDeleted,
  onEditStudent,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.trim().toLowerCase();

    const studentId = String(student.studentId || "").toLowerCase();
    const name = String(student.name || "").toLowerCase();
    const email = String(student.email || "").toLowerCase();
    const course = String(student.course || "").toLowerCase();

    const matchesSearch =
      !search ||
      studentId.includes(search) ||
      name.includes(search) ||
      email.includes(search) ||
      course.includes(search);

    const matchesCourse =
      !selectedCourse ||
      String(student.course || "").toLowerCase() ===
        selectedCourse.toLowerCase();

    const matchesYear =
      !selectedYear ||
      String(student.year || "") === selectedYear;

    return matchesSearch && matchesCourse && matchesYear;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * studentsPerPage;

  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (student) => {
    const id = student._id || student.id || student.studentId;

    if (!id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (confirmed && onStudentDeleted) {
      onStudentDeleted(id);
    }
  };

  const getCourseClass = (course) => {
    const value = String(course || "").toLowerCase();

    if (value === "cse") return "course-badge cse";
    if (value === "ece") return "course-badge ece";
    if (value === "eee") return "course-badge eee";
    if (value === "ds") return "course-badge ds";

    return "course-badge";
  };

  return (
    <section className="student-directory">
      <div className="directory-header">
        <div className="directory-title">
          <div className="directory-icon">
            <Users size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h2>Student Directory</h2>
            <p>View, search, edit or remove student records.</p>
          </div>
        </div>

        <div className="directory-filters">
          <div className="select-wrapper">
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">All Courses</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="DS">DS</option>
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="select-wrapper">
            <select
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="directory-search">
        <div className="directory-search-input">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search by name, ID, email or course..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        <button
          className="directory-search-btn"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="student-table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>COURSE</th>
              <th>YEAR</th>
              <th>PHONE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student, index) => (
                <tr
                  key={
                    student._id ||
                    student.id ||
                    student.studentId ||
                    index
                  }
                >
                  <td className="student-id">
                    {student.studentId || "—"}
                  </td>

                  <td className="student-name">
                    {student.name || "—"}
                  </td>

                  <td className="student-email">
                    {student.email || "—"}
                  </td>

                  <td>
                    <span className={getCourseClass(student.course)}>
                      {student.course || "—"}
                    </span>
                  </td>

                  <td>{student.year || "—"}</td>

                  <td>{student.phone || "—"}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="edit-btn"
                        title="Edit Student"
                        onClick={() => {
                          if (onEditStudent) {
                            onEditStudent(student);
                          }
                        }}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete Student"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="empty-students"
                >
                  <Users size={32} />
                  <strong>No students found</strong>
                  <span>
                    Try changing your search or filters.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="directory-footer">
        <p>
          Showing{" "}
          <strong>
            {displayedStudents.length}
          </strong>{" "}
          of{" "}
          <strong>
            {filteredStudents.length}
          </strong>{" "}
          students
        </p>

        <div className="pagination">
          <button
            disabled={safePage === 1}
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              className={safePage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            disabled={safePage === totalPages}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default StudentDirectory;