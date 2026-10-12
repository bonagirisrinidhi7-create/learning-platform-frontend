import { useNavigate } from "react-router-dom";

function TrainerDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Trainer";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cardStyle = {
    background: "white",
    padding: 28,
    borderRadius: 20,
    boxShadow: "0 10px 30px #17203310"
  };

  const buttonStyle = {
    padding: "12px 18px",
    background: "#5145e5",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6fc",
      fontFamily: "Arial, sans-serif",
      color: "#172033"
    }}>
      <nav style={{
        background: "white",
        padding: "22px 7%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 15,
        boxShadow: "0 3px 15px #00000010"
      }}>
        <h2 style={{ color: "#5145e5", margin: 0 }}>LearnAI Trainer</h2>
        <div>
          <strong style={{ marginRight: 20 }}>{username}</strong>
          <button onClick={logout} style={{
            ...buttonStyle,
            background: "#172033"
          }}>Logout</button>
        </div>
      </nav>

      <main style={{ maxWidth: 1150, margin: "auto", padding: "50px 25px" }}>
        <p style={{ color: "#5145e5", fontWeight: "bold" }}>
          TRAINER WORKSPACE
        </p>

        <h1 style={{ fontSize: 36 }}>Welcome, {username}! 👋</h1>

        <p style={{ color: "#667085", fontSize: 17 }}>
          Manage learning materials and support your learners.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 25,
          marginTop: 35
        }}>
          <section style={cardStyle}>
            <h2>📚 Learning Materials</h2>
            <p>View and access available study materials.</p>
            <button style={buttonStyle} onClick={() => navigate("/upload")}>
              Upload Materials
            </button>
            <button
              style={{ ...buttonStyle, marginLeft: 8, marginTop: 10 }}
              onClick={() => navigate("/quiz")}
            >
              View Materials
            </button>
          </section>

          <section style={cardStyle}>
            <h2>📝 Assessments</h2>
            <p>Open quizzes to review the available questions.</p>
            <button style={buttonStyle} onClick={() => navigate("/quiz")}>
              View Quizzes
            </button>
          </section>

          <section style={cardStyle}>
            <h2>📊 Learner Progress</h2>
            <p>Open the learner progress page to review assessment results.</p>
            <button
              style={buttonStyle}
              onClick={() => navigate("/learner-progress")}
            >
              Open Dashboard
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TrainerDashboard;