import { useEffect, useState } from "react";
import {
  createCourseRegistration,
  getSemesters,
} from "../services/courseRegistrationService";

export default function CourseRegistrationPage() {
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
      console.log("Registering course with:", form);

      const result = await createCourseRegistration({
        studentId: parseInt(form.studentId, 10),
        courseId: parseInt(form.courseId, 10),
        year: parseInt(form.year, 10),
        semester: form.semester,
      });

      console.log("Course registration result:", result);

      setMessage("Course registration successful!");
      setMessageType("success");
      setForm({ studentId: "", courseId: "", year: "", semester: "" });
    } catch (error) {
      console.error("Course registration error:", error);
      setMessage("Error: " + (error.message || "Registration failed"));
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setForm({ studentId: "", courseId: "", year: "", semester: "" });
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Course Registration</h1>

      {message && (
        <p
          className={`mb-4 p-2 rounded text-center ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
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
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student ID"
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
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            min="1900"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter year"
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
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
