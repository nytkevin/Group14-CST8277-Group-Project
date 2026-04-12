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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Assign Grade </h1>
      {message && (
        <p
          className={`mb-4 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}

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
          <label className="block font-medium">Letter Grade</label>
          <select
            name="letterGrade"
            value={form.letterGrade}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Grade</option>
            {grades.map((grade, index) => (
              <option key={index} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row space-x-2">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
