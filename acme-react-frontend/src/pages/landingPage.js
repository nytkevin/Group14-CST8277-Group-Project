export default function LandingPage({ loggedIn, onSignOut, onSignIn }) {
  const handleSignOut = () => {
    localStorage.removeItem("auth");
    onSignOut();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wide">ACME COLLEGE</div>
        {loggedIn ? (
          <button
            onClick={handleSignOut}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
