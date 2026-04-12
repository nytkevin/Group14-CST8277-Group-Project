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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          Student Management
        </h2>

        <div className="flex gap-2 mb-4">
            <button
              onClick={handleNewStudent}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              + Add Student
            </button>

            <button
              onClick={loadStudents}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Refresh
            </button>
        </div>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 mb-6 p-4 border rounded-lg bg-gray-50"
          >
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={form[field]}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            ))}

            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Program</option>
              {programs.map((p, index) => (
                  <option key={p.id || index} value={p.name || p}>
                    {p.name || p}
                  </option>
                ))}
            </select>

            <div className="md:col-span-2">
              <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
            </div>
          </form>
        )}

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">First</th>
              <th className="p-2">Last</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Program</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-100 text-center">
                <td className="p-2">{s.id}</td>
                <td>{s.firstName}</td>
                <td>{s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.program}</td>
                <td>
                  <Actions
                    onEdit={() => handleEdit(s)}
                    onDelete={() => handleDelete(s.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
