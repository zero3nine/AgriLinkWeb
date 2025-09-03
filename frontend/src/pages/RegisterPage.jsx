import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.message) {
      alert("Registered successfully!");
      navigate("/login"); // redirect to login
    } else {
      setMessage(data.error || "Registration failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required /><br /><br />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
