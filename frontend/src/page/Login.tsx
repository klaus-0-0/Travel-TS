import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import wall from "../assets/t9.jpg"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${config.apiUrl}/login`,
        { email, password }
      );
      console.log(response.data.user.role);
      
      if (response.data.user.role === "ADMIN") {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/Admindashboard");
      } else {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Login Failed! Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <img
        src={wall}
        alt="Background"
        className="absolute w-full h-full object-cover opacity-100"
      />
      
      {/* Navbar */}
      <nav className="w-full bg-transparent p-4 flex justify-end relative z-10">
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-6">
          <button
            className="text-white font-bold text-sm md:text-base"
            onClick={() => navigate("")}
          >
            About
          </button>
          <button
            className="bg-black text-white py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
          <button
            className="bg-white hover:bg-gray-500 text-black border border-black py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center lg:justify-start p-4 relative z-10 backdrop-blur-xs">
        <div className="w-full max-w-md lg:ml-60 bg-transparent bg-opacity-90 p-6 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black">Login</h2>
            <p className="text-black mt-2">Welcome back</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-center pt-4 gap-4">
              <button
                className="w-60 bg-black text-white py-2 px-4 rounded font-medium transition cursor-pointer disabled:opacity-50"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-900 text-sm">
              Don't have an account?{" "}
              <button
                className="text-white font-bold text-2xl cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;