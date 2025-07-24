import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        alert("✅ Login successful!");
        navigate("/home");
      } else {
        alert("Login failed!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Invalid credentials!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p>
        New user?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;