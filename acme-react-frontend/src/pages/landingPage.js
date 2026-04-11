export default function LandingPage({ loggedIn, onSignOut, onSignIn }) {
  const handleSignOut = () => {
    localStorage.removeItem("auth");
    onSignOut();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">ACME COLLEGE</div>
        {loggedIn ? (
          <button
            onClick={handleSignOut}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
