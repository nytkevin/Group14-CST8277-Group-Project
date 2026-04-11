import { useState } from "react";

export default function AssignGradePage() {
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    letterGrade: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.courseId || !form.letterGrade) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/course-registrations/assign-grade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: parseInt(form.studentId),
            courseId: parseInt(form.courseId),
            letterGrade: form.letterGrade.toUpperCase(),
          }),
        },
      );

      if (res.ok) {
        setMessage("Grade assigned successfully!");
        setForm({ studentId: "", courseId: "", letterGrade: "" });
      } else {
        const err = await res.json();
        setMessage("Error: " + err.message || res.statusText);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Assign Grade </h1>
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
          <label className="block font-medium">Letter Grade</label>
          <input
            type="text"
            name="letterGrade"
            value={form.letterGrade}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="A, B+, etc."
            maxLength={3}
            required
          />
        </div>
        <div className="flex flex-row space-x-2">
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() =>
              setForm({ studentId: "", courseId: "", letterGrade: "" })
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
