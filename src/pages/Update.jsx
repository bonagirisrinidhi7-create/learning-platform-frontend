
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Update() {
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("username") || "";

  const [form, setForm] = useState({
    username: currentUsername,
    email: localStorage.getItem("email") || "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        "http://localhost:8080/update",
        {
          currentUsername,
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password
        }
      );

      const updatedUser = response.data;

      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("email", updatedUser.email || "");
      localStorage.setItem("role", updatedUser.role || "LEARNER");

      setMessage("Account updated successfully!");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Account update failed."
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f7fc",
      display: "grid",
      placeItems: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "450px",
        boxSizing: "border-box",
        background: "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 10px 30px #00000010"
      }}>
        <h1 style={{ color: "#4f46e5" }}>Update Account</h1>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>New password (optional)</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current password"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ ...buttonStyle, background: "#64748b" }}
        >
          Cancel
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  margin: "8px 0 18px",
  border: "1px solid #d1d5db",
  borderRadius: "8px"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};