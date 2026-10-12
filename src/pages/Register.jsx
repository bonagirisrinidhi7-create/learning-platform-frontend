import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("LEARNER");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        {
          username,
          email,
          password,
          role
        }
      );

      setMessage(response.data.message);

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("LEARNER");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      if (error.response) {
        setMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Registration failed"
        );
      } else {
        setMessage("Backend is not reachable");
      }
    }
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
          background: "white",
          padding: "40px",
          borderRadius: "25px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#172033"
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#667085",
            marginBottom: "30px"
          }}
        >
          Join your personalized learning platform
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              boxSizing: "border-box",
              background: "white"
            }}
          >
            <option value="LEARNER">Learner</option>
            <option value="TRAINER">Trainer</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#172033",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Register
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: message === "Registration successful"
                ? "green"
                : "red"
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#667085"
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#172033",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;