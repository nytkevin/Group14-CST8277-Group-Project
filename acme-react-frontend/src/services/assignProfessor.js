const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// Assign/PUT professor
export const assignProfessor = (studentId, courseId, professorId) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/professor`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(professorId),
    },
  );
