import { useEffect, useState } from "react";
import {
  getStudents,
  getPrograms,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";
import Actions from "../components/actions";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    program: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadStudents = () => {
    getStudents()
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  const loadPrograms = () => {
    getPrograms()
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadStudents();
    loadPrograms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      program: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateStudent(editingId, form).then(() => {
        setEditingId(null);
        resetForm();
        setShowForm(false);
        loadStudents();
      });
    } else {
      createStudent(form).then(() => {
        resetForm();
        setShowForm(false);
        loadStudents();
      });
    }
  };

  const handleEdit = (student) => {
    setForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      program: student.program || "",
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteStudent(id).then(loadStudents);
  };

  const handleNewStudent = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">abanyeshuri</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleNewStudent}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Student
        </button>
        <button
          onClick={loadStudents}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-4 grid-cols-1 md:grid-cols-2"
        >
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <select
            name="program"
            value={form.program}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option
                key={program.id || program}
                value={program.name || program}
              >
                {program.name || program}
              </option>
            ))}
          </select>

          <div className="md:col-span-2">
            <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
          </div>
        </form>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Program</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border border-gray-300 p-2">{student.id}</td>
              <td className="border border-gray-300 p-2">
                {student.firstName}
              </td>
              <td className="border border-gray-300 p-2">{student.lastName}</td>
              <td className="border border-gray-300 p-2">{student.email}</td>
              <td className="border border-gray-300 p-2">{student.phone}</td>
              <td className="border border-gray-300 p-2">{student.program}</td>
              <td className="border border-gray-300 p-2">
                <Actions
                  onEdit={() => handleEdit(student)}
                  onDelete={() => handleDelete(student.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
