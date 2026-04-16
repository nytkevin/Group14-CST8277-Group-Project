import { useState } from "react";

export default function ClubMembershipPage({ onCancelPage }) {
  const [form, setForm] = useState({ studentId: "", clubId: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.clubId) {
      setMessage("Both student and club are required!");
      setMessageType("error");
      return;
    }

    try {
      const token = localStorage.getItem("auth");
      const res = await fetch(
        "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1/studentclub/" +
          parseInt(form.clubId) +
          "/member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            id: parseInt(form.studentId),
          }),
        },
      );

      if (res.ok) {
        setMessage("Student successfully registered to the club!");
        setMessageType("success");
        setForm({ studentId: "", clubId: "" });
      } else {
        const text = await res.text();
        if (text && text.trim().startsWith("<!DOCTYPE html")) {
          throw new Error(`Server returned status ${res.status}. Please check if the IDs are valid and exist.`);
        }
        
        let errMsg = res.statusText;
        try {
          const errObj = JSON.parse(text);
          errMsg = errObj.message || errMsg;
        } catch (e) {
          errMsg = text || errMsg;
        }
        setMessage("Error: " + errMsg);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Club Membership</h1>

      {message && (
        <p
          className={`mb-4 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          placeholder="Student ID"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
        />

        <input
          name="clubId"
          value={form.clubId}
          onChange={handleChange}
          placeholder="Club ID"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
        />

        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Submit
          </button>
          <button
            type="button"
            onClick={onCancelPage}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
