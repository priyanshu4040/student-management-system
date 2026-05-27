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

  // Auth states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Token state
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const API_URL = "http://localhost:8083/students";
  const LOGIN_URL = "http://localhost:8083/auth/login";
  const REGISTER_URL = "http://localhost:8083/auth/register";

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Registration failed");
      }

      alert(message || "User registered successfully");

      setUsername("");
      setPassword("");
      setIsRegister(false);
    } catch (error) {
      console.log("Register error:", error);
      alert("Registration failed");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setUsername("");
      setPassword("");

      alert("Login successful");
    } catch (error) {
      console.log("Login error:", error);
      alert("Login failed. Please check username and password.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setStudents([]);
    alert("Logged out successfully");
  }

  async function fetchStudents() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    if (token) {
      fetchStudents();
    }
  }, [token]);

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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        });
      } else {
        response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      alert("Failed to save student");
    }
  }

  function handleEdit(student) {
    setEditId(student.id);
    setName(student.studentName);
    setCourse(student.subjectName);
    setMarks(student.marks);
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      fetchStudents();
    } catch (error) {
      console.log("Error deleting student:", error);
      alert("Failed to delete student");
    }
  }

  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(search.toLowerCase())
  );

  // Login/Register page
  if (!token) {
    return (
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "400px" }}>
          <h2 className="text-center text-primary mb-4">
            {isRegister ? "Register" : "Login"}
          </h2>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <div className="text-center mt-3">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setIsRegister(false)}
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setIsRegister(true)}
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main student management page
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Student Management System</h1>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card shadow p-4 mb-5">
        <h2 className="text-center text-primary mb-4">
          {editId === null ? "Add Student" : "Update Student"}
        </h2>

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

            {editId !== null && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setCourse("");
                  setMarks("");
                }}
              >
                Cancel
              </button>
            )}
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