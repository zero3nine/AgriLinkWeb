import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      window.location.href = "/"; // redirect to home
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
