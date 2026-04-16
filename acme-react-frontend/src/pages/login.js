import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(username, password);
    if (success) {
      onSuccess();
    } else {
      setError("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to ACME College
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
      />

      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
        Login
      </button>
    </form>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
