const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
};

// GET all clubs
export const getClubs = () =>
  fetch(`${BASE_URL}/studentclub`, {
    headers: getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => ({ data }));

// CREATE club
export const createClub = (club) =>
  fetch(`${BASE_URL}/studentclub`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(club),
  }).then((res) => res.json());

// UPDATE club
export const updateClub = (id, club) =>
  fetch(`${BASE_URL}/studentclub/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(club),
  }).then((res) => res.json());

// DELETE club
export const deleteClub = (id) =>
  fetch(`${BASE_URL}/studentclub/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => res.ok);
