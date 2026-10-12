
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Delete() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");

    if (confirm.trim() !== username.trim()) {
      setError("Enter your username correctly to confirm.");
      return;
    }

    if (!window.confirm("Permanently delete this account?")) {
      return;
    }

    try {
      await axios.delete("http://localhost:8080/delete", {
        params: { username }
      });

      localStorage.clear();
      navigate("/");
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Account deletion failed."
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
      <form onSubmit={handleDelete} style={{
        width: "100%",
        maxWidth: "450px",
        boxSizing: "border-box",
        background: "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 10px 30px #00000010"
      }}>
        <h1 style={{ color: "#dc2626" }}>Delete Account</h1>

        <p>This action permanently deletes your account.</p>

        <label>Type your username: {username}</label>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{ ...buttonStyle, background: "#dc2626" }}
        >
          Delete My Account
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ ...buttonStyle, background: "#64748b" }}
        >
          Cancel
        </button>

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