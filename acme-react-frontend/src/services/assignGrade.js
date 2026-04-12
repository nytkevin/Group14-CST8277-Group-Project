const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// CREATE professor
export const assignGrade = (studentId, courseId, grade) =>
  fetch(
    `${BASE_URL}/courseregistration/student/${studentId}/course/${courseId}/grade`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(grade),
    },
  ).then((res) => res.json());

export const getLetterGrades = () =>
  fetch(`${BASE_URL}/courseregistration/lettergrade`, {
    headers: getAuthHeaders(),
  }).then((res) => res.json());
