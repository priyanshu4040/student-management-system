import { useState, useEffect } from "react";

// the name of functional component should start with uppercase otherwise the browser can't recognize it.
function Demo() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [students, setStudents] = useState([]);

  const API_URL = "http://localhost:8082/students";

  //An async function allows us to write asynchronous code that works with Promises. Inside an async function, we can use await to pause execution until a Promise is resolved or rejected.
  async function fetchStudents() {
    try {
      //fetch returns a promise, means we should use await with it, i.e wait until promise is not resolve
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);

    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => { fetchStudents() }, []);

  async function addStudent(e) {
    e.preventDefault();

    const newStudent = {
      studentName: name,
      subjectName: course,
      marks: Number(marks)
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        fetchStudent();

        setName("");
        setCourse("");
        setMarks();
      }
    }
    catch (err) {
      console.log("Error adding student " + err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchStudents();
    } catch (error) {
      console.log("Error deleting student:", error);
    }
  }


  return (
    <>
      <form onSubmit={addStudent}>
        <h1>Student Management System</h1>

        <section className="datafield">
          <input
            name="name"
            type="text"
            required
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            name="course"
            type="text"
            required
            placeholder="Enter course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <input
            name="marks"
            type="number"
            required
            placeholder="Enter marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          <button id="add_student" type="submit">
            Add Student
          </button>
        </section>

      </form>

      <h2>Student List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Marks</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.studentName}</td>
              <td>{student.subjectName}</td>
              <td>{student.marks}</td>
              <td><button onClick={() => { handleDelete() }}>DELETE</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Demo;