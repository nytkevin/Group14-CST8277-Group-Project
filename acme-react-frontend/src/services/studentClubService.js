// GET
export const getClubs = () =>
  fetch("http://localhost:8080/api/clubs")
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE
export const createClub = (club) =>
  fetch("http://localhost:8080/api/clubs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(club),
  }).then((res) => res.json());

// UPDATE
export const updateClub = (id, club) =>
  fetch(`http://localhost:8080/api/clubs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(club),
  }).then((res) => res.json());

// DELETE
export const deleteClub = (id) =>
  fetch(`http://localhost:8080/api/clubs/${id}`, {
    method: "DELETE",
  }).then((res) => res.ok);
