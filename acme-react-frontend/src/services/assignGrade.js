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

// ASSIGN grade — backend expects Content-Type: text/plain with raw grade string
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
  ).then(handleResponse);
};

export const getLetterGrades = () =>
  fetch(`${BASE_URL}/courseregistration/lettergrade`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);
