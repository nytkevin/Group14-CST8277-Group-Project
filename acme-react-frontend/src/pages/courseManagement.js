import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseManagementService";
import Actions from "../components/actions";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseCode: "",
    courseTitle: "",
    creditUnits: "",
    online: "0",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadCourses = () => {
    getCourses()
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      creditUnits: Number(form.creditUnits),
      online: form.online === "1",
    };

    if (editingId) {
      updateCourse(editingId, payload).then(() => {
        setEditingId(null);
        setForm({
          courseCode: "",
          courseTitle: "",
          creditUnits: "",
          online: "0",
        });
        setShowForm(false);
        loadCourses();
      });
    } else {
      createCourse(payload).then(() => {
        setForm({
          courseCode: "",
          courseTitle: "",
          creditUnits: "",
          online: "0",
        });
        setShowForm(false);
        loadCourses();
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      courseCode: "",
      courseTitle: "",
      creditUnits: "",
      online: "0",
    });
    setShowForm(false);
  };

  const handleEdit = (course) => {
    setForm({
      courseCode: course.courseCode || "",
      courseTitle: course.courseTitle || "",
      creditUnits: course.creditUnits?.toString() || "",
      online: course.online?.toString() ?? "0",
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteCourse(id).then(loadCourses);
  };

  const handleNewCourse = () => {
    setEditingId(null);
    setForm({
      courseCode: "",
      courseTitle: "",
      creditUnits: "",
      online: "0",
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          Course Management
        </h2>

        <button
          onClick={handleNewCourse}
          className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Add New Course
        </button>
        <button
          onClick={loadCourses}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-60"
        >
          Refresh
        </button>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <input
              name="courseCode"
              value={form.courseCode}
              onChange={handleChange}
              placeholder="Code"
              className="border p-2 rounded focus:ring-emerald-500"
            />

            <input
              name="courseTitle"
              value={form.courseTitle}
              onChange={handleChange}
              placeholder="Title"
              className="border p-2 rounded"
            />

            <input
              type="number"
              name="creditUnits"
              value={form.creditUnits}
              onChange={handleChange}
              placeholder="Credits"
              className="border p-2 rounded"
            />

            <select
              name="online"
              value={form.online}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="0">Offline</option>
              <option value="1">Online</option>
            </select>

            <div className="md:col-span-2">
              <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
            </div>
          </form>
        )}

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Title</th>
              <th>Credits</th>
              <th>Online</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="text-center hover:bg-gray-100">
                <td>{c.id}</td>
                <td>{c.courseCode}</td>
                <td>{c.courseTitle}</td>
                <td>{c.creditUnits}</td>
                <td>{c.online ? "Yes" : "No"}</td>
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
