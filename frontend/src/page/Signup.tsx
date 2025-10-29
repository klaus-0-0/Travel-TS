import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import wall from "../assets/t8.jpg"

const Signup = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem("user-info");
    if (info) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    try {
      const userData = await axios.post(`${config.apiUrl}/signup`, {
        username,
        email,
        password,
        role
      });
      
      if (userData.data.user.role === "ADMIN") {
        localStorage.setItem("token", JSON.stringify(userData.data.token));
        navigate("/Admindashboard");
      } else {
        localStorage.setItem("token", JSON.stringify(userData.data.token));
        navigate("/Dashboard");
      }
    } catch (error: any) {
      console.error("Signup Failed:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <img
        src={wall}
        alt="Background"
        className="absolute w-full h-full object-cover opacity-100"
      />

      <nav className="w-full bg-transparent p-4 flex justify-end relative z-10 border-b-2">
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-6">
          <button
            className="text-black font-bold text-sm md:text-base"
            onClick={() => navigate("")}
          >
            About
          </button>
          <button
            className="bg-black hover:bg-cyan-700 text-white py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={handleSignup}
          >
            Sign up
          </button>
          <button
            className="bg-white hover:bg-cyan-700 text-black border border-black py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center lg:justify-start p-4 relative z-10 backdrop-blur-xs">
        <div className="w-full max-w-md lg:ml-80 bg-transparent bg-opacity-90 p-6 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Welcome</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-black rounded p-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              className="w-full border border-black rounded p-2"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full border border-black rounded p-2"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <select
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="flex justify-center pt-4 gap-4">
              <button
                className="w-50 bg-black text-white py-2 px-4 rounded font-medium transition cursor-pointer"
                onClick={handleSignup}
              >
                Sign up
              </button>
              <button
                className="w-50 bg-white hover:bg-cyan-700 text-black border border-black py-2 px-4 rounded font-medium transition cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;