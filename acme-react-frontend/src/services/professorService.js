const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// GET all professors
export const getProfessors = () =>
  fetch(`${BASE_URL}/professor`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET degrees for dropdown
export const getDegrees = () =>
  fetch(`${BASE_URL}/professor/degree`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE professor
export const createProfessor = (professor) =>
  fetch(`${BASE_URL}/professor`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(professor),
  }).then((res) => res.json());

// UPDATE professor
export const updateProfessor = (id, professor) =>
  fetch(`${BASE_URL}/professor/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(professor),
  }).then((res) => res.json());

// DELETE professor
export const deleteProfessor = (id) =>
  fetch(`${BASE_URL}/professor/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => res.ok);
