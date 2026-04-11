import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";
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

    if (editingId) {
      updateCourse(editingId, form).then(() => {
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
      createCourse(form).then(() => {
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Course Management</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleNewCourse}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Course
        </button>
        <button
          onClick={loadCourses}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Course Code</label>
              <input
                name="courseCode"
                placeholder="Course Code"
                value={form.courseCode}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Course Title</label>
              <input
                name="courseTitle"
                placeholder="Course Title"
                value={form.courseTitle}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Credit Units</label>
              <input
                type="number"
                name="creditUnits"
                placeholder="Credit Units"
                value={form.creditUnits}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Online</label>
              <select
                name="online"
                value={form.online}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Actions onSubmit onCancel={handleCancel} editing={!!editingId} />
          </div>
        </form>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Code</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Credits</th>
            <th className="border border-gray-300 p-2">Online</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="border border-gray-300 p-2">{c.id}</td>
              <td className="border border-gray-300 p-2">{c.courseCode}</td>
              <td className="border border-gray-300 p-2">{c.courseTitle}</td>
              <td className="border border-gray-300 p-2">{c.creditUnits}</td>
              <td className="border border-gray-300 p-2">{c.online}</td>
              <td className="border border-gray-300 p-2">
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
  );
}
