const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers (JSON)
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// Helper for checking response before parsing
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
};

// GET all course registrations
export const getCourseRegistrations = () =>
  fetch(`${BASE_URL}/courseregistration`, {
    headers: getAuthHeaders(),
  })
    .then(handleResponse)
    .then((data) => ({ data }));

// GET user's course registrations
export const getMyCourseRegistrations = () =>
  fetch(`${BASE_URL}/courseregistration/my`, {
    headers: getAuthHeaders(),
  })
    .then(handleResponse)
    .then((data) => ({ data }));

// CREATE course registration
// Backend expects nested student/course objects: { student: { id }, course: { id }, year, semester }
export const createCourseRegistration = async (registration) => {
  const payload = {
    student: { id: registration.studentId },
    course: { id: registration.courseId },
    year: registration.year,
    semester: registration.semester,
  };

  const res = await fetch(`${BASE_URL}/courseregistration`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }

  return res.json();
};

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
    .then(handleResponse)
    .catch((error) => {
      console.error("Error assigning professor:", error);
      throw error;
    });

// ASSIGN grade to course registration
// Backend expects Content-Type: text/plain for this endpoint
export const assignGrade = (studentId, courseId, grade) => {
  const token = localStorage.getItem("auth");
  return fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/grade`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        ...(token && { Authorization: token }),
      },
      body: grade,
    },
  )
    .then((res) => res.ok)
    .catch((error) => {
      console.error("Error assigning grade:", error);
      throw error;
    });
};

// GET available semesters
export const getSemesters = () =>
  fetch(`${BASE_URL}/courseregistration/semester`, {
    headers: getAuthHeaders(),
  })
    .then(handleResponse)
    .then((data) => ({ data }));

// GET available letter grades
export const getLetterGrades = () =>
  fetch(`${BASE_URL}/courseregistration/lettergrade`, {
    headers: getAuthHeaders(),
  })
    .then(handleResponse)
    .then((data) => ({ data }));
