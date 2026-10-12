
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import LearnerProgress from "./pages/LearnerProgress";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import UploadMaterial from "./pages/UploadMaterial";
import Update from "./pages/Update";
import Delete from "./pages/Delete";

function Home() {
  const navigate = useNavigate();

  const section = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const buttonStyle = {
    padding: "13px 24px",
    background: "#172033",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      color: "#172033",
      background: "white"
    }}>
      <nav style={{
        padding: "20px 7%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        borderBottom: "1px solid #eee"
      }}>
        <h2 style={{ margin: 0, color: "#5145e5" }}>LearnAI</h2>

        <div style={{
          display: "flex",
          gap: "22px",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </span>

          <span onClick={() => section("courses")} style={{ cursor: "pointer" }}>
            Courses
          </span>

          <span onClick={() => section("about")} style={{ cursor: "pointer" }}>
            About
          </span>

          <button onClick={() => navigate("/login")} style={buttonStyle}>
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{ ...buttonStyle, background: "#5145e5" }}
          >
            Register
          </button>
        </div>
      </nav>

      <section style={{
        minHeight: "75vh",
        padding: "65px 8%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "45px",
        flexWrap: "wrap",
        background: "#f7f9fc"
      }}>
        <div style={{ flex: "1 1 350px", maxWidth: "620px" }}>
          <p style={{ color: "#5145e5", fontWeight: "bold" }}>
            AI-POWERED PERSONALIZED LEARNING
          </p>

          <h1 style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            margin: "20px 0"
          }}>
            Learn smarter.<br />Improve faster.
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#667085",
            lineHeight: 1.8
          }}>
            Practice with AI-generated quizzes, understand your performance,
            identify learning gaps, and discover personalized recommendations.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={{ ...buttonStyle, marginTop: "20px" }}
          >
            Start Learning
          </button>
        </div>

        <div style={{
          flex: "1 1 280px",
          maxWidth: "380px",
          padding: "35px",
          background: "white",
          borderRadius: "25px",
          boxShadow: "15px 20px 45px #17203318",
          transform: "perspective(900px) rotateY(-5deg)"
        }}>
          <h3>Your Learning Progress</h3>
          <h1 style={{ fontSize: "48px", color: "#5145e5" }}>78%</h1>

          <div style={{
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "10px"
          }}>
            <div style={{
              width: "78%",
              height: "100%",
              background: "#5145e5",
              borderRadius: "10px"
            }} />
          </div>

          <p style={{ color: "#667085" }}>Personalized for you</p>
        </div>
      </section>

      <section id="courses" style={{
        padding: "65px 7%",
        textAlign: "center"
      }}>
        <h2>Explore Learning</h2>

        <p style={{ color: "#667085" }}>
          Learn, practice, assess your knowledge, and improve.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "22px",
          marginTop: "30px"
        }}>
          {[
            ["AI Quizzes", "Practice questions generated from learning materials."],
            ["Assessments", "Check your understanding and track your scores."],
            ["Recommendations", "Find relevant material for topics you need to improve."]
          ].map(([title, description]) => (
            <div key={title} style={{
              width: "230px",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 8px 25px #0000000d"
            }}>
              <h3>{title}</h3>

              <p style={{ color: "#667085", lineHeight: 1.6 }}>
                {description}
              </p>

              <button onClick={() => navigate("/login")} style={buttonStyle}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="about" style={{
        padding: "55px 8%",
        textAlign: "center",
        background: "#f7f9fc"
      }}>
        <h2>About LearnAI</h2>

        <p style={{
          maxWidth: "750px",
          margin: "20px auto",
          color: "#667085",
          lineHeight: 1.8
        }}>
          LearnAI helps learners practice with AI-generated quizzes, understand
          their performance, identify competency gaps, and find relevant
          learning materials.
        </p>
      </section>

      <footer style={{
        padding: "25px",
        textAlign: "center",
        background: "#172033",
        color: "white"
      }}>
        © LearnAI | Personalized Learning Platform
      </footer>
    </div>
  );
}

function RoleDashboard() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  if (role?.trim().toUpperCase() === "TRAINER") {
    return <TrainerDashboard />;
  }

  return <Dashboard />;
}

function ProtectedLearnerProgress() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  if (role?.trim().toUpperCase() !== "TRAINER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <LearnerProgress />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<RoleDashboard />} />
      <Route path="/trainer-dashboard" element={<RoleDashboard />} />
      <Route
        path="/learner-progress"
        element={<ProtectedLearnerProgress />}
      />

      <Route path="/quiz" element={<Quiz />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/upload" element={<UploadMaterial />} />

      <Route path="/update" element={<Update />} />
      <Route path="/delete" element={<Delete />} />

      <Route
        path="*"
        element={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>Page not found</h2>
            <button onClick={() => window.location.assign("/")}>
              Return Home
            </button>
          </div>
        }
      />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
