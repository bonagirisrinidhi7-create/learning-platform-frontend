import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter username and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          username,
          password
        }
      );

      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.id);

      setMessage("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      if (error.response) {
        setMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Login failed"
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
        padding: "30px"
      }}
    >
      <div
        style={{
          width: "400px",
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
          Welcome Back
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#667085",
            marginBottom: "30px"
          }}
        >
          Login to your learning platform
        </p>

        <form onSubmit={handleLogin}>
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

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
            Login
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: message === "Login successful"
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
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#172033",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;