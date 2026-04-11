import { useEffect, useState } from "react";

export default function CourseRegistrationPage() {
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    year: "",
    semester: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch semesters from backend
    fetch("http://localhost:8080/api/semesters")
      .then((res) => res.json())
      .then((data) => setSemesters(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.courseId || !form.year || !form.semester) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/course-registrations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: parseInt(form.studentId),
            courseId: parseInt(form.courseId),
            year: parseInt(form.year),
            semester: form.semester,
          }),
        },
      );

      if (res.ok) {
        setMessage("Course registration successful!");
        setForm({ studentId: "", courseId: "", year: "", semester: "" });
      } else {
        const err = await res.json();
        setMessage("Error: " + (err.message || res.statusText));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Course Registration</h1>
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
          <label className="block font-medium">Year</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter year"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Semester</label>
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row space-x-2">
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() =>
              setForm({ studentId: "", courseId: "", year: "", semester: "" })
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
