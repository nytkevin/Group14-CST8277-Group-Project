import { useEffect, useState } from "react";
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
} from "../services/studentClubManagementService";
import Actions from "../components/actions";

export default function StudentClub() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    academic: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadClubs = () => {
    getClubs().then((res) => setClubs(res.data));
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitPromise = editingId
      ? updateClub(editingId, form)
      : createClub(form);

    submitPromise
      .then(() => {
        setEditingId(null);
        setForm({ name: "", description: "", academic: false });
        setShowForm(false);
        loadClubs();
      })
      .catch((error) => {
        console.error("Error submitting club:", error);
        alert("Error saving club. Please try again.");
      });
  };

  const handleCancel = () => {
    setForm({ name: "", description: "", academic: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (club) => {
    setForm({
      name: club.name || "",
      description: club.desc || "",
      academic: club.academic,
    });
    setEditingId(club.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteClub(id).then(loadClubs);
  };

  const handleNewClub = () => {
    setShowForm(true);
    setEditingId(null);
    setForm({ name: "", description: "", academic: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          Student Club Management
        </h2>

        <button
          onClick={handleNewClub}
          className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          + New Club
        </button>
        <button
          onClick={loadClubs}
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
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Club Name"
              className="w-full border p-2 rounded"
            />

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <select
              name="academic"
              value={form.academic.toString()}
              onChange={(e) =>
                setForm({ ...form, academic: e.target.value === "true" })
              }
              className="w-full border p-2 rounded"
            >
              <option value="false">Non-Academic</option>
              <option value="true">Academic</option>
            </select>

            <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
          </form>
        )}

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Academic</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {clubs.map((c) => (
              <tr key={c.id} className="text-center hover:bg-gray-100">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.desc}</td>
                <td>{c.academic ? "Yes" : "No"}</td>
                <td>
                  <Actions
                    onEdit={() => handleEdit(c)}
                    onDelete={() => handleDelete(c.id)}
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
