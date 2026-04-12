const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// GET all course registrations
export const getCourseRegistrations = () =>
  fetch(`${BASE_URL}/courseregistration`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET user's course registrations
export const getMyCourseRegistrations = () =>
  fetch(`${BASE_URL}/courseregistration/my`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE course registration
export const createCourseRegistration = (registration) =>
  fetch(`${BASE_URL}/courseregistration`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(registration),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error creating course registration:", error);
      throw error;
    });

// DELETE course registration
export const deleteCourseRegistration = (studentId, courseId) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  ).then((res) => res.ok);

// ASSIGN professor to course registration
export const assignProfessor = (studentId, courseId, professorId) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/professor`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: professorId }),
    },
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error assigning professor:", error);
      throw error;
    });

// ASSIGN grade to course registration
export const assignGrade = (studentId, courseId, grade) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/grade`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: grade,
    },
  )
    .then((res) => res.ok)
    .catch((error) => {
      console.error("Error assigning grade:", error);
      throw error;
    });

// GET available semesters
export const getSemesters = () =>
  fetch(`${BASE_URL}/courseregistration/semester`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// GET available letter grades
export const getLetterGrades = () =>
  fetch(`${BASE_URL}/courseregistration/lettergrade`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));
