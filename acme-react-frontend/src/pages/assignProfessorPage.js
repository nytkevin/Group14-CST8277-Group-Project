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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
  <h1 className="text-xl font-bold mb-4 text-gray-800">Assign Professor</h1>

  {message && <p className="mb-4 text-green-600">{message}</p>}

  <form onSubmit={handleSubmit} className="space-y-4">
    <input name="studentId" value={form.studentId} onChange={handleChange}
      placeholder="Student ID"
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"/>

    <input name="courseId" value={form.courseId} onChange={handleChange}
      placeholder="Course ID"
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"/>

    <input name="professorId" value={form.professorId} onChange={handleChange}
      placeholder="Professor ID"
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"/>

    <div className="flex gap-2">
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Submit</button>
      <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
        Cancel
      </button>
    </div>
  </form>
</div>
  );
}
