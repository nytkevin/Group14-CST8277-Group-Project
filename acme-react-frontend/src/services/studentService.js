const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// GET all students
export const getStudents = () =>
  fetch(`${BASE_URL}/student`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET programs for dropdown
export const getPrograms = () =>
  fetch(`${BASE_URL}/student/program`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE student
export const createStudent = (student) =>
  fetch(`${BASE_URL}/student`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  }).then((res) => res.json());

// UPDATE student
export const updateStudent = (id, student) =>
  fetch(`${BASE_URL}/student/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  }).then((res) => res.json());

// DELETE student
export const deleteStudent = (id) =>
  fetch(`${BASE_URL}/student/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => res.ok);
