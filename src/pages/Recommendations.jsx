
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Recommendations() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }

    const loadRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/assessment/recommendations/${encodeURIComponent(username)}`
        );

        setRecommendations(
          Array.isArray(response.data) ? response.data : []
        );
      } catch {
        setError("Unable to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [username, navigate]);

  const getPriorityStyle = (priority) => {
    if (priority === "HIGH") {
      return {
        background: "#fee2e2",
        color: "#b91c1c"
      };
    }

    if (priority === "MEDIUM") {
      return {
        background: "#fef3c7",
        color: "#92400e"
      };
    }

    return {
      background: "#dcfce7",
      color: "#166534"
    };
  };

  const openMaterial = (materialId) => {
    if (!materialId) return;

    window.open(
      `http://localhost:8080/materials/${materialId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        color: "#172033",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <nav
        style={{
          background: "#ffffff",
          minHeight: "75px",
          padding: "15px 6%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <h2 style={{ margin: 0, color: "#4f46e5" }}>
          LearnAI
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px"
          }}
        >
          <span style={{ fontWeight: "600" }}>{username}</span>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "11px 20px",
              background: "#172033",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px"
        }}
      >
        <p
          style={{
            color: "#4f46e5",
            fontWeight: "700",
            letterSpacing: "1px"
          }}
        >
          YOUR LEARNING JOURNEY
        </p>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            marginBottom: "10px"
          }}
        >
          Personalized Recommendations
        </h1>

        <p
          style={{
            color: "#667085",
            lineHeight: 1.7,
            marginBottom: "30px"
          }}
        >
          Discover what to study next based on your latest assessment scores.
        </p>

        {loading && (
          <div
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "18px",
              textAlign: "center"
            }}
          >
            Loading your recommendations...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              color: "#b91c1c"
            }}
          >
            <h3>{error}</h3>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#4f46e5",
                color: "white",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "40px 25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
            }}
          >
            <h2>No recommendations yet</h2>

            <p style={{ color: "#667085", lineHeight: 1.7 }}>
              Complete a quiz to receive study suggestions based on your score.
            </p>

            <button
              onClick={() => navigate("/quiz")}
              style={{
                marginTop: "12px",
                padding: "13px 24px",
                borderRadius: "10px",
                border: "none",
                background: "#4f46e5",
                color: "white",
                cursor: "pointer"
              }}
            >
              Take a Quiz
            </button>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "18px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "22px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.04)"
                }}
              >
                <p style={{ color: "#667085", margin: 0 }}>
                  Topics assessed
                </p>

                <h2 style={{ fontSize: "32px", margin: "10px 0 0" }}>
                  {new Set(recommendations.map(item => item.topic)).size}
                </h2>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "22px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.04)"
                }}
              >
                <p style={{ color: "#667085", margin: 0 }}>
                  Need revision
                </p>

                <h2
                  style={{
                    fontSize: "32px",
                    margin: "10px 0 0",
                    color: "#b91c1c"
                  }}
                >
                  {
                    new Set(
                      recommendations
                        .filter(item => item.priority === "HIGH")
                        .map(item => item.topic)
                    ).size
                  }
                </h2>
              </div>
            </div>

            <h2 style={{ marginBottom: "18px" }}>Your study plan</h2>

            {recommendations.map((item, index) => (
              <div
                key={`${item.topic}-${item.materialId ?? "none"}`}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "18px",
                  marginBottom: "18px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  border: "1px solid #e8ebf3"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ flex: "1 1 240px" }}>
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

                    <h3 style={{ fontSize: "23px", margin: "0 0 14px" }}>
                      {item.topic}
                    </h3>

                    <p
                      style={{
                        color: "#475467",
                        margin: "0 0 18px",
                        lineHeight: 1.6
                      }}
                    >
                      {item.message}
                    </p>
                  </div>

                  <span
                    style={{
                      ...getPriorityStyle(item.priority),
                      padding: "8px 13px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}
                  >
                    {item.priority} PRIORITY
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "14px"
                  }}
                >
                  <span style={{ color: "#667085" }}>
                    Latest quiz score
                  </span>

                  <strong>
                    {Number(item.percentage).toFixed(2)}%
                  </strong>
                </div>

                <div
                  style={{
                    height: "9px",
                    background: "#e9edf5",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(item.percentage) || 0)
                      )}%`,
                      background:
                        item.priority === "HIGH"
                          ? "#ef4444"
                          : item.priority === "MEDIUM"
                          ? "#f59e0b"
                          : "#22c55e",
                      borderRadius: "10px",
                      transition: "width 0.5s ease"
                    }}
                  />
                </div>

                {item.materialAvailable && item.materialId && (
                  <div
                    style={{
                      marginTop: "18px",
                      padding: "16px",
                      background: "#f8faff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "12px"
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#667085",
                        fontSize: "13px"
                      }}
                    >
                      RECOMMENDED STUDY MATERIAL
                    </p>

                    <h4 style={{ margin: "0 0 4px" }}>
                      {item.title}
                    </h4>

                    {item.fileName && (
                      <p
                        style={{
                          margin: 0,
                          color: "#667085",
                          fontSize: "13px"
                        }}
                      >
                        {item.fileName}
                      </p>
                    )}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}
                >
                  <button
                    onClick={() => navigate("/quiz")}
                    style={{
                      ...buttonStyle,
                      background: "#4f46e5"
                    }}
                  >
                    Practice Again
                  </button>

                  {item.materialAvailable && item.materialId && (
                    <button
                      onClick={() => openMaterial(item.materialId)}
                      style={{
                        ...buttonStyle,
                        background: "#172033"
                      }}
                    >
                      Open PDF
                    </button>
                  )}
                </div>

                {!item.materialAvailable && (
                  <p
                    style={{
                      marginTop: "16px",
                      color: "#667085",
                      fontSize: "14px"
                    }}
                  >
                    No matching PDF is uploaded for this topic yet.
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default Recommendations;
