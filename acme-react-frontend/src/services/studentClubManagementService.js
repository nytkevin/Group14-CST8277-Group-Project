const BASE_URL = "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1";

// Helper function to get auth headers
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

// GET all clubs
export const getClubs = () =>
  fetch(`${BASE_URL}/studentclub`, {
    headers: getAuthHeaders(),
  })
    .then(handleResponse)
    .then((data) => ({ data }));

// CREATE club
// Backend uses @JsonTypeInfo with property "type" for polymorphic deserialization.
// Must send "type": "academic" or "type": "non-academic" instead of a boolean.
// Backend field for description is "desc", not "description".
export const createClub = (club) => {
  const payload = {
    name: club.name,
    desc: club.description,
    type: club.academic ? "academic" : "non-academic",
  };

  return fetch(`${BASE_URL}/studentclub`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

// UPDATE club
export const updateClub = (id, club) => {
  const payload = {
    name: club.name,
    desc: club.description,
    type: club.academic ? "academic" : "non-academic",
  };

  return fetch(`${BASE_URL}/studentclub/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

// DELETE club
export const deleteClub = (id) =>
  fetch(`${BASE_URL}/studentclub/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => res.ok);
