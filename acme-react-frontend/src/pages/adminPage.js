import { useState } from "react";
import Login from "./login";
import { useAuth } from "../contexts/AuthContext";
import StudentManagement from "./studentManagement";
import CourseManagement from "./courseManagement";
import ProfessorManagement from "./professorManagement";
import StudentClub from "./studentsClubManagement";
import CourseRegistrationPage from "./courseRegistration";
import AssignProfessorPage from "./assignProfessorPage";
import AssignGradePage from "./assignGradePage";
import ClubMembershipPage from "./clubMembershipRegistration";
import LandingPage from "./landingPage";
const pageMap = {
  "Student Management": StudentManagement,
  "Course Management": CourseManagement,
  "Professor Management": ProfessorManagement,
  "Student Club Management": StudentClub,
  "Course Registration": CourseRegistrationPage,
  "Assign Professor": AssignProfessorPage,
  "Assign Grade": AssignGradePage,
  "Club Membership Registration": ClubMembershipPage,
};

export default function AdminPage({ loggedIn, showLogin, setShowLogin }) {
  const { logout } = useAuth();
  const [option, setOption] = useState("");
  const [activePage, setActivePage] = useState("");

  const PageComponent = activePage ? pageMap[activePage] : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <LandingPage
        loggedIn={loggedIn}
        onSignOut={logout}
        onSignIn={() => setShowLogin(true)}
      />

      {loggedIn && (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6"> ACME College Admin Dashboard</h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Select a page</label>
              <select
                value={option}
                onChange={(e) => {
                  const value = e.target.value;
                  setOption(value);
                  setActivePage(value);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option> None</option>
                <option value="Student Management">Student Management</option>
                <option value="Course Management">Course Management</option>
                <option value="Professor Management">
                  Professor Management
                </option>
                <option value="Student Club Management">
                  Student Club Management
                </option>
                <option value="Course Registration">Course Registration</option>
                <option value="Assign Professor">Assign Professor</option>
                <option value="Assign Grade">Assign Grade</option>
                <option value="Club Membership Registration">
                  Club Membership Registration
                </option>
              </select>
            </div>
          </div>

          {PageComponent && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">{activePage}</h2>
              <div className="border rounded bg-gray-50 p-5">
                <PageComponent
                  onCancelPage={() => {
                    setActivePage("");
                    setOption("");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full shadow-lg">
            <Login onSuccess={() => setShowLogin(false)} />
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
