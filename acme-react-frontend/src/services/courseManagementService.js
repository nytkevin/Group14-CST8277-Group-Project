const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// GET all courses
export const getCourses = () =>
  fetch(`${BASE_URL}/course`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE course
export const createCourse = (course) =>
  fetch(`${BASE_URL}/course`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(course),
  }).then((res) => res.json());

// UPDATE course
export const updateCourse = (id, course) =>
  fetch(`${BASE_URL}/course/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(course),
  }).then((res) => res.json());

// DELETE course
export const deleteCourse = (id) =>
  fetch(`${BASE_URL}/course/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => res.ok);
