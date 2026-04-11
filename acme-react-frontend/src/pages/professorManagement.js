import { useEffect, useState } from "react";
import {
  getProfessors,
  getDegrees,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from "../services/professorService";
import Actions from "../components/actions";

export default function ProfessorManagement() {
  const [professors, setProfessors] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    degree: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProfessors = () => {
    getProfessors()
      .then((res) => setProfessors(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProfessors();
    getDegrees()
      .then((res) => setDegrees(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateProfessor(editingId, form).then(() => {
        setEditingId(null);
        setForm({ firstName: "", lastName: "", degree: "" });
        setShowForm(false);
        loadProfessors();
      });
    } else {
      createProfessor(form).then(() => {
        setForm({ firstName: "", lastName: "", degree: "" });
        setShowForm(false);
        loadProfessors();
      });
    }
  };

  const handleCancel = () => {
    setForm({ firstName: "", lastName: "", degree: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (prof) => {
    setForm(prof);
    setEditingId(prof.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteProfessor(id).then(loadProfessors);
  };

  const handleNewProfessor = () => {
    setShowForm(true);
    setEditingId(null);
    setForm({ firstName: "", lastName: "", degree: "" });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Professor Management</h2>

      <div className="mb-4">
        <button
          onClick={handleNewProfessor}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Professor
        </button>
        <button
          onClick={loadProfessors}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="mb-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-2">
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-2">
            <select
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Degree</option>
              {degrees.map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </div>
          <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
        </form>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Degree</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((p) => (
            <tr key={p.id}>
              <td className="border border-gray-300 p-2">{p.id}</td>
              <td className="border border-gray-300 p-2">{p.firstName}</td>
              <td className="border border-gray-300 p-2">{p.lastName}</td>
              <td className="border border-gray-300 p-2">{p.degree}</td>
              <td className="border border-gray-300 p-2">
                <Actions
                  onEdit={() => handleEdit(p)}
                  onDelete={() => handleDelete(p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
