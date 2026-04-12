import { useState } from "react";
import { assignProfessor } from "../services/assignProfessor";

export default function AssignProfessorPage({ onCancelPage }) {
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    professorId: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.courseId || !form.professorId) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const res = await assignProfessor(
        parseInt(form.studentId),
        parseInt(form.courseId),
        parseInt(form.professorId),
      );

      if (res.ok) {
        setMessage("Professor assigned successfully!");
        setForm({ studentId: "", courseId: "", professorId: "" });
      } else {
        const errText = await res.text(); // safer than res.json()
        setMessage("Error: " + errText);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Assign Professor to Course</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Student ID</label>
          <input
            type="number"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter student ID"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Course ID</label>
          <input
            type="number"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter course ID"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Professor ID</label>
          <input
            type="number"
            name="professorId"
            value={form.professorId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter professor ID"
            required
          />
        </div>

        <div className="flex flex-row space-x-2">
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() => {
              setForm({ studentId: "", courseId: "", professorId: "" });
              setMessage("");
              if (onCancelPage) onCancelPage();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
