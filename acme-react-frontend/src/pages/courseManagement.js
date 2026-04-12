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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Course Management</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleNewCourse}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Course
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
            <th className="border border-gray-300 p-2">Course Code </th>
            <th className="border border-gray-300 p-2">Course Title</th>
            <th className="border border-gray-300 p-2">Credits Units </th>
            <th className="border border-gray-300 p-2">Online</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border border-gray-300 p-2">{course.id}</td>
              <td className="border border-gray-300 p-2">
                {course.courseCode}
              </td>
              <td className="border border-gray-300 p-2">
                {course.courseTitle}
              </td>
              <td className="border border-gray-300 p-2">
                {course.creditUnits}
              </td>
              <td className="border border-gray-300 p-2">
                {course.online ? 1 : 0}
              </td>
              <td className="border border-gray-300 p-2">
                <Actions
                  onEdit={() => handleEdit(course)}
                  onDelete={() => handleDelete(course.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={loadCourses}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-60"
      >
        Refresh
      </button>
    </div>
  );
}
