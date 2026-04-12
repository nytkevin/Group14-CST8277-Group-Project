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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Student Club Management</h2>

      <div className="mb-4">
        <button
          onClick={handleNewClub}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Student Club
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="mb-2">
            <input
              name="name"
              placeholder="Club Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-2">
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Academic</label>
            <select
              name="academic"
              value={form.academic.toString()}
              onChange={(e) => {
                const value = e.target.value === "true";
                setForm({ ...form, academic: value });
              }}
              className="w-full border rounded p-2"
              required
            >
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </div>
          <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
        </form>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Academic</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.id}>
              <td className="border border-gray-300 p-2">{club.id}</td>
              <td className="border border-gray-300 p-2">{club.name}</td>
              <td className="border border-gray-300 p-2">{club.desc}</td>
              <td className="border border-gray-300 p-2">
                {club.academic.toString()}
              </td>
              <td className="border border-gray-300 p-2">
                <Actions
                  onEdit={() => handleEdit(club)}
                  onDelete={() => handleDelete(club.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={loadClubs}
        className="ml-60 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );
}
