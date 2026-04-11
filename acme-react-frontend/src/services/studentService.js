// GET
export const getStudents = () =>
  fetch("http://localhost:8080/api/students")
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET programs
export const getPrograms = () =>
  fetch("http://localhost:8080/api/programs")
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE
export const createStudent = (student) =>
  fetch("http://localhost:8080/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  }).then((res) => res.json());

// UPDATE
export const updateStudent = (id, student) =>
  fetch(`http://localhost:8080/api/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  }).then((res) => res.json());

// DELETE
export const deleteStudent = (id) =>
  fetch(`http://localhost:8080/api/students/${id}`, {
    method: "DELETE",
  }).then((res) => res.ok);
