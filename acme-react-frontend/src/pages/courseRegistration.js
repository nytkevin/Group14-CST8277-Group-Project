import { useEffect, useState } from "react";
import {
  createCourseRegistration,
  getSemesters,
} from "../services/courseRegistrationService";

export default function CourseRegistrationPage({ onCancelPage }) {
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    year: "",
    semester: "",
  });
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSemesters()
      .then((res) => setSemesters(res.data || []))
      .catch((error) => {
        console.error("Error loading semesters:", error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!form.studentId || !form.courseId || !form.year || !form.semester) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    try {
      await createCourseRegistration({
        studentId: parseInt(form.studentId, 10),
        courseId: parseInt(form.courseId, 10),
        year: parseInt(form.year, 10),
        semester: form.semester,
      });

      setMessage("Course registration successful!");
      setMessageType("success");
      setForm({ studentId: "", courseId: "", year: "", semester: "" });
    } catch (error) {
      setMessage("Error: " + (error.message || "Registration failed"));
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setForm({ studentId: "", courseId: "", year: "", semester: "" });
    setMessage("");
    setMessageType("");
    if (onCancelPage) onCancelPage();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Course Registration
        </h1>

        {message && (
          <p
            className={`mb-4 p-3 rounded text-center font-medium ${
              messageType === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="number"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <input
              type="number"
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              placeholder="Enter course ID"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              min="1900"
              value={form.year}
              onChange={handleChange}
              placeholder="Enter year"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select semester</option>
              {semesters.map((sem, index) => (
                <option key={index} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
            >
              Register
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}