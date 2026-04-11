// GET all professors
export const getProfessors = () =>
  fetch("http://localhost:8080/api/professors")
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET degrees
export const getDegrees = () =>
  fetch("http://localhost:8080/api/degrees")
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE professor
export const createProfessor = (professor) =>
  fetch("http://localhost:8080/api/professors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(professor),
  }).then((res) => res.json());

// UPDATE professor
export const updateProfessor = (id, professor) =>
  fetch(`http://localhost:8080/api/professors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(professor),
  }).then((res) => res.json());

// DELETE professor
export const deleteProfessor = (id) =>
  fetch(`http://localhost:8080/api/professors/${id}`, {
    method: "DELETE",
  }).then((res) => res.ok);
