# ACME College REST API Endpoints

**Base URL:** `http://localhost:8080/REST-ACMECollege-Skeleton/api/v1`
**Authentication:** HTTP Basic Auth

---

## 🧑‍🎓 Student Endpoints
| HTTP Method | Endpoint Path | Required Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/student` | `ADMIN_ROLE` | Get a list of all students |
| `GET` | `/student/{id}` | `ADMIN_ROLE`, `USER_ROLE` | Get a specific student (Users can only get themselves) |
| `POST` | `/student` | `ADMIN_ROLE` | Create a new student (Requires JSON body) |
| `PUT` | `/student/{id}` | `ADMIN_ROLE` | Update an existing student |
| `DELETE` | `/student/{id}` | `ADMIN_ROLE` | Delete a student from the DB |
| `GET` | `/student/program` | `ADMIN_ROLE`, `USER_ROLE` | Fetch frontend dropdown lookup values for all distinct Programs |

---

## 📚 Course Endpoints
| HTTP Method | Endpoint Path | Required Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/course` | `ADMIN_ROLE` | Get a list of all courses |
| `GET` | `/course/{id}` | `ADMIN_ROLE` | Get a specific course |
| `POST` | `/course` | `ADMIN_ROLE` | Create a new course |
| `PUT` | `/course/{id}` | `ADMIN_ROLE` | Update an existing course |
| `DELETE` | `/course/{id}` | `ADMIN_ROLE` | Delete a course |

---

## 👨‍🏫 Professor Endpoints
| HTTP Method | Endpoint Path | Required Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/professor` | `ADMIN_ROLE` | Get a list of all professors |
| `GET` | `/professor/{id}` | `ADMIN_ROLE`, `USER_ROLE` | Get a specific professor (Users can only get professors they are registered with) |
| `POST` | `/professor` | `ADMIN_ROLE` | Create a new professor |
| `PUT` | `/professor/{id}` | `ADMIN_ROLE` | Update an existing professor |
| `DELETE` | `/professor/{id}` | `ADMIN_ROLE` | Delete a professor |
| `GET` | `/professor/degree` | `ADMIN_ROLE`, `USER_ROLE` | Fetch frontend dropdown lookup values for all distinct Degrees |

---

## 🎸 Student Club Endpoints
| HTTP Method | Endpoint Path | Required Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/studentclub` | `ADMIN_ROLE`, `USER_ROLE` | Get a list of all student clubs |
| `GET` | `/studentclub/{id}` | `ADMIN_ROLE`, `USER_ROLE` | Get a specific club |
| `POST` | `/studentclub` | `ADMIN_ROLE` | Create a new student club |
| `PUT` | `/studentclub/{id}` | `ADMIN_ROLE` | Update an existing student club |
| `DELETE` | `/studentclub/{id}` | `ADMIN_ROLE` | Delete a student club |

---

## 📋 Course Registration Endpoints
| HTTP Method | Endpoint Path | Required Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/courseregistration` | `ADMIN_ROLE` | Get all student registrations in the database |
| `GET` | `/courseregistration/my` | `USER_ROLE` | Get all course registrations belonging to the currently logged in user |
| `POST` | `/courseregistration` | `ADMIN_ROLE` | Create a new student registration for a course |
| `DELETE`| `/courseregistration/student/{sId}/course/{cId}` | `ADMIN_ROLE` | Delete a specific registration |
| `PUT` | `/courseregistration/student/{sId}/course/{cId}/professor`| `ADMIN_ROLE` | Assign a new professor to a specific registration (Expects JSON body `{ "id": 1 }`) |
| `PUT` | `/courseregistration/student/{sId}/course/{cId}/grade`| `ADMIN_ROLE` | Assign a letter grade to a specific registration (Expects plain text body e.g. `A+`) |
| `GET` | `/courseregistration/lettergrade` | `ADMIN_ROLE`, `USER_ROLE` | Fetch frontend dropdown lookup values for all possible Letter Grades |
| `GET` | `/courseregistration/semester` | `ADMIN_ROLE`, `USER_ROLE` | Fetch frontend dropdown lookup values for all possible Semesters |
