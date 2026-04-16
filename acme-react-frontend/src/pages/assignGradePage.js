import { useState, useEffect } from "react";
import { assignGrade, getLetterGrades } from "../services/assignGrade";

export default function AssignGradePage({ onCancelPage }) {
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    letterGrade: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [grades, setGrades] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.courseId || !form.letterGrade) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    try {
      await assignGrade(
        parseInt(form.studentId),
        parseInt(form.courseId),
        form.letterGrade,
      );
      setMessage("Grade assigned successfully!");
      setMessageType("success");
      setForm({ studentId: "", courseId: "", letterGrade: "" });
    } catch (error) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setForm({ studentId: "", courseId: "", letterGrade: "" });
    setMessage("");
    setMessageType("");
    if (onCancelPage) onCancelPage();
  };

  useEffect(() => {
    getLetterGrades()
      .then((data) => setGrades(data))
      .catch(() => setMessage("Failed to load grades"));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
  <h1 className="text-xl font-bold mb-4 text-gray-800">Assign Grade</h1>

  {message && (
    <p className={`mb-4 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
      {message}
    </p>
  )}

  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="number"
      name="studentId"
      value={form.studentId}
      onChange={handleChange}
      placeholder="Student ID"
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
    />

    <input
      type="number"
      name="courseId"
      value={form.courseId}
      onChange={handleChange}
      placeholder="Course ID"
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
    />

    <select
      name="letterGrade"
      value={form.letterGrade}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
    >
      <option value="">Select Grade</option>
      {grades.map((g, i) => <option key={i}>{g}</option>)}
    </select>

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
