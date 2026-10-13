
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://learning-platform-backend-x13o.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("LEARNER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: username.trim(),
        email: email.trim(),
        password,
        role
      });

      setMessage(response.data.message || "Registration successful");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("LEARNER");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (error.response) {
        setMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Registration failed"
        );
      } else {
        setMessage(
          "Backend connection failed. Check your Render URL and backend status."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #d0d5dd",
    fontSize: "16px",
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "420px",
          maxWidth: "100%",
          background: "white",
          padding: "40px",
          borderRadius: "25px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ textAlign: "center", color: "#172033" }}>
          Create Account
        </h1>

        <p style={{ textAlign: "center", color: "#667085", marginBottom: "30px" }}>
          Join your personalized learning platform
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ ...inputStyle, background: "white" }}
          >
            <option value="LEARNER">Learner</option>
            <option value="TRAINER">Trainer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#172033",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: message === "Registration successful" ? "green" : "red",
              overflowWrap: "anywhere"
            }}
          >
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "25px", color: "#667085" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#172033", fontWeight: "600", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
