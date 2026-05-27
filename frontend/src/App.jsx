import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:8083/students";

  async function fetchStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const marksValue = Number(marks);

    if (marksValue < 0 || marksValue > 100) {
      alert("Marks should be between 0 and 100");
      setMarks("");
      return;
    }
    const studentData = {
      studentName: name,
      subjectName: course,
      marks: Number(marks),
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        });
      } else {
        response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        });

        setEditId(null);
      }

      if (!response.ok) {
        throw new Error("Failed to save student");
      }

      setName("");
      setCourse("");
      setMarks("");

      fetchStudents();
    } catch (error) {
      console.log("Error saving student:", error);
    }
  }

  function handleEdit(student) {
    setEditId(student.id);
    setName(student.studentName);
    setCourse(student.subjectName);
    setMarks(student.marks);
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      fetchStudents();
    } catch (error) {
      console.log("Error deleting student:", error);
    }
  }

  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mb-5">
        <h1 className="text-center text-primary mb-4">
          Student Management System
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                name="name"
                type="text"
                required
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input
                name="course"
                type="text"
                required
                className="form-control"
                placeholder="Enter course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input
                name="marks"
                type="number"
                required
                className="form-control"
                placeholder="Enter marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className={editId === null ? "btn btn-success" : "btn btn-warning"}
              type="submit"
            >
              {editId === null ? "Add Student" : "Update Student"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-center mb-4">Student List</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search student by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive"></div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-muted">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.studentName}</td>
                  <td>{student.subjectName}</td>
                  <td>{student.marks}</td>
                  <td>{student.grade}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;