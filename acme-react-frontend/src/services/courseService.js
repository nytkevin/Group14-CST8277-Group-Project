// GET all
export const getCourses = () =>
  fetch("http://localhost:8080/api/courses")
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE
export const createCourse = (course) =>
  fetch("http://localhost:8080/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  }).then((res) => res.json());

// UPDATE
export const updateCourse = (id, course) =>
  fetch(`http://localhost:8080/api/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  }).then((res) => res.json());

// DELETE
export const deleteCourse = (id) =>
  fetch(`http://localhost:8080/api/courses/${id}`, {
    method: "DELETE",
  }).then((res) => res.ok);
