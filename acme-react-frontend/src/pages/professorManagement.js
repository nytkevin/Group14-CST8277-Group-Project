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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          Professor Management
        </h2>

        <button
          onClick={handleNewProfessor}
          className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          + New Professor
        </button>
        <button
          onClick={loadProfessors}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-60"
        >
          Refresh
        </button>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg"
          >
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border p-2 rounded"
            />

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border p-2 rounded"
            />

            <select
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Degree</option>
              {degrees.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
          </form>
        )}

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th>ID</th>
              <th>First</th>
              <th>Last</th>
              <th>Degree</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {professors.map((p) => (
              <tr key={p.id} className="text-center hover:bg-gray-100">
                <td>{p.id}</td>
                <td>{p.firstName}</td>
                <td>{p.lastName}</td>
                <td>{p.degree}</td>
                <td>
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
    </div>
  );
}
