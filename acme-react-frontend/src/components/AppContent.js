import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminPage from "../pages/adminPage";

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <AdminPage
        loggedIn={isAuthenticated}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />
    </div>
  );
}

export default AppContent;
