const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// Assign professor to a course registration
// Backend expects PUT (not POST) and body: { "id": professorId }
export const assignProfessor = (studentId, courseId, professorId) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/professor`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: professorId }),
    },
  );
