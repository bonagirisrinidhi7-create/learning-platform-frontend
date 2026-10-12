
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role") || "LEARNER";

  const [results, setResults] = useState([]);
  const [competency, setCompetency] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [improvements, setImprovements] = useState([]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      if (!username) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/assessment/performance/${encodeURIComponent(username)}`
        );
        setResults(Array.isArray(response.data) ? response.data : []);
      } catch {
        setResults([]);
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/assessment/competency/${encodeURIComponent(username)}`
        );

        const data = Array.isArray(response.data) ? response.data : [];
        setCompetency(data);

        const improvementData = await Promise.all(
          data.map(async (item) => {
            try {
              const result = await axios.get(
                `http://localhost:8080/assessment/improvement/${encodeURIComponent(username)}/${encodeURIComponent(item.topic)}`
              );
              return typeof result.data === "object" && result.data !== null
                ? result.data
                : null;
            } catch {
              return null;
            }
          })
        );

        setImprovements(improvementData.filter(Boolean));
      } catch {
        setCompetency([]);
        setImprovements([]);
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/assessment/recommendations/${encodeURIComponent(username)}`
        );
        setRecommendations(Array.isArray(response.data) ? response.data : []);
      } catch {
        setRecommendations([]);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [username, navigate]);

  const strongAreas = competency.filter(
    (item) => item.performance === "STRONG"
  ).length;

  const needsImprovement = competency.filter(
    (item) => item.performance === "NEEDS_IMPROVEMENT"
  ).length;

  const learningProgress =
    competency.length > 0
      ? Math.round(
          competency.reduce(
            (sum, item) => sum + (Number(item.percentage) || 0),
            0
          ) / competency.length
        )
      : 0;

  const getPriorityStyle = (priority) => {
    if (priority === "HIGH") {
      return { background: "#fee2e2", color: "#b91c1c" };
    }

    if (priority === "MEDIUM") {
      return { background: "#fef3c7", color: "#92400e" };
    }

    return { background: "#dcfce7", color: "#166534" };
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    minWidth: 0,
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        fontFamily: "Arial, sans-serif",
        color: "#172033"
      }}
    >
      <nav
        style={{
          minHeight: "75px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "15px",
          padding: "15px 6%",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ margin: 0, color: "#4f46e5" }}>LearnAI</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontWeight: "600" }}>{username}</span>
          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#172033",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 5%" }}>
        <div style={{ marginBottom: "35px" }}>
          <p style={{ color: "#4f46e5", fontWeight: "700", letterSpacing: "1px" }}>
            YOUR PERSONAL LEARNING SPACE
          </p>

          <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginBottom: "10px" }}>
            Welcome, {username} 👋
          </h1>

          <p style={{ color: "#667085", fontSize: "17px" }}>
            Continue your personalized learning journey.
          </p>
        </div>

        {loading ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
            Loading your learning data...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
              }}
            >
              {[
                { title: "Learning Progress", value: `${learningProgress}%` },
                { title: "Assessments", value: results.length },
                { title: "Strong Areas", value: strongAreas },
                { title: "Needs Improvement", value: needsImprovement }
              ].map((item) => (
                <div key={item.title} style={cardStyle}>
                  <p style={{ color: "#667085", marginTop: 0 }}>{item.title}</p>
                  <h2 style={{ fontSize: "32px", marginBottom: 0 }}>{item.value}</h2>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "22px",
                marginBottom: "25px"
              }}
            >
              <div style={cardStyle}>
                <h2>Take Assessment</h2>
                <p style={{ color: "#667085", lineHeight: 1.7 }}>
                  Test your knowledge and discover your strong and weak areas.
                </p>
                <button onClick={() => navigate("/quiz")} style={buttonStyle}>
                  Start Quiz
                </button>
              </div>

              <div style={cardStyle}>
                <h2>Personalized Recommendations</h2>
                <p style={{ color: "#667085", lineHeight: 1.7 }}>
                  Find out which topics need revision and what you should practise next.
                </p>
                <p style={{ fontWeight: "600" }}>
                  {recommendations.length} topic recommendation(s)
                </p>
                <button
                  onClick={() => navigate("/recommendations")}
                  style={buttonStyle}
                >
                  View Recommendations
                </button>
              </div>
            </div>

            <section style={{ ...cardStyle, marginBottom: "25px" }}>
              <h2>Your Competency</h2>

              {competency.length === 0 ? (
                <p style={{ color: "#667085" }}>
                  Complete an assessment to view your competency.
                </p>
              ) : (
                competency.map((item) => {
                  const percentage = Math.min(
                    100,
                    Math.max(0, Number(item.percentage) || 0)
                  );

                  return (
                    <div
                      key={item.topic}
                      style={{ padding: "20px 0", borderBottom: "1px solid #eeeeee" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "15px",
                          flexWrap: "wrap"
                        }}
                      >
                        <div>
                          <h3 style={{ margin: 0 }}>{item.topic}</h3>
                          <p style={{ color: "#667085", marginBottom: 0 }}>
                            Performance: <strong>{item.performance}</strong>
                          </p>
                        </div>
                        <strong>{percentage.toFixed(2)}%</strong>
                      </div>

                      <div
                        style={{
                          height: "9px",
                          background: "#e5e7eb",
                          borderRadius: "10px",
                          marginTop: "15px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background:
                              percentage >= 80
                                ? "#16a34a"
                                : percentage >= 60
                                ? "#f59e0b"
                                : "#ef4444",
                            borderRadius: "10px"
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            <section style={{ ...cardStyle, marginBottom: "25px" }}>
              <h2>Learning Improvement</h2>

              {improvements.length === 0 ? (
                <p style={{ color: "#667085" }}>
                  Complete the same topic assessment at least twice to see your improvement.
                </p>
              ) : (
                improvements.map((item) => (
                  <div
                    key={item.topic}
                    style={{
                      padding: "20px",
                      marginTop: "15px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "15px"
                    }}
                  >
                    <h3>{item.topic}</h3>
                    <p>Previous score: <strong>{item.previousScore}%</strong></p>
                    <p>Latest score: <strong>{item.latestScore}%</strong></p>
                    <p>
                      Improvement:{" "}
                      <strong>
                        {item.improvement > 0 ? "+" : ""}{item.improvement}%
                      </strong>
                    </p>
                    <p>Status: <strong>{item.status}</strong></p>
                  </div>
                ))
              )}
            </section>

            <section style={{ ...cardStyle, marginBottom: "25px" }}>
              <h2>Personalized Study Recommendations</h2>

              <p style={{ color: "#667085", lineHeight: 1.7 }}>
                Recommendations are based on your latest assessment score for each topic.
              </p>

              {recommendations.length === 0 ? (
                <p style={{ color: "#667085" }}>
                  Complete a quiz to receive personalized recommendations.
                </p>
              ) : (
                recommendations.map((item, index) => {
                  const percentage = Math.min(
                    100,
                    Math.max(0, Number(item.percentage) || 0)
                  );

                  return (
                    <div
                      key={item.topic}
                      style={{
                        padding: "22px",
                        marginTop: "18px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap"
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: "#667085",
                              fontSize: "13px",
                              fontWeight: "700",
                              margin: "0 0 8px"
                            }}
                          >
                            STUDY PRIORITY {index + 1}
                          </p>
                          <h3 style={{ margin: 0 }}>{item.topic}</h3>
                        </div>

                        <span
                          style={{
                            ...getPriorityStyle(item.priority),
                            padding: "8px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700"
                          }}
                        >
                          {item.priority} PRIORITY
                        </span>
                      </div>

                      <p style={{ color: "#667085" }}>
                        Latest score: {percentage.toFixed(2)}%
                      </p>
                      <p style={{ lineHeight: 1.7 }}>{item.message}</p>

                      <div
                        style={{
                          height: "9px",
                          background: "#e9edf5",
                          borderRadius: "10px",
                          overflow: "hidden",
                          marginBottom: "18px"
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background:
                              item.priority === "HIGH"
                                ? "#ef4444"
                                : item.priority === "MEDIUM"
                                ? "#f59e0b"
                                : "#22c55e",
                            borderRadius: "10px"
                          }}
                        />
                      </div>

                      <button onClick={() => navigate("/quiz")} style={buttonStyle}>
                        Practice Again
                      </button>
                    </div>
                  );
                })
              )}

              <button
                onClick={() => navigate("/recommendations")}
                style={{ ...buttonStyle, marginTop: "22px", background: "#172033" }}
              >
                View All Recommendations
              </button>
            </section>

            <section style={cardStyle}>
              <h2>Your Account</h2>

              <p><strong>Username:</strong> {username}</p>
              <p><strong>Email:</strong> {email || "Not available"}</p>
              <p><strong>Role:</strong> {role}</p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "20px"
                }}
              >
                <button
                  onClick={() => navigate("/update")}
                  style={buttonStyle}
                >
                  Update Account
                </button>

                <button
                  onClick={() => navigate("/delete")}
                  style={{ ...buttonStyle, background: "#dc2626" }}
                >
                  Delete Account
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;