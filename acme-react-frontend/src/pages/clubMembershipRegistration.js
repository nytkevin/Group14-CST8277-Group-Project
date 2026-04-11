import { useState } from "react";

export default function ClubMembershipPage() {
  const [form, setForm] = useState({ studentId: "", clubId: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.clubId) {
      setMessage("Both student and club are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/club-memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: parseInt(form.studentId),
          clubId: parseInt(form.clubId),
        }),
      });

      if (res.ok) {
        setMessage("Student successfully registered to the club!");
        setForm({ studentId: "", clubId: "" });
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
      <h1 className="text-xl font-bold mb-4">Club Membership Registration</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}

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
          <label className="block font-medium">Club ID</label>
          <input
            type="number"
            name="clubId"
            value={form.clubId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter club ID"
            required
          />
        </div>

        <div className="flex flex-row space-x-2">
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() => setForm({ studentId: "", clubId: "" })}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
