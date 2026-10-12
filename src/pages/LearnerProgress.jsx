import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LearnerProgress() {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLearnerProgress = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/getalldata"
        );

        const users = Array.isArray(response.data)
          ? response.data
          : [];

        const learnerUsers = users.filter(
          (user) => user.role?.trim().toUpperCase() === "LEARNER"
        );

        setLearners(learnerUsers);

        const resultEntries = await Promise.all(
          learnerUsers.map(async (user) => {
            try {
              const resultResponse = await axios.get(
                `http://localhost:8080/assessment/performance/${encodeURIComponent(
                  user.username
                )}`
              );

              return [
                user.username,
                Array.isArray(resultResponse.data)
                  ? resultResponse.data
                  : []
              ];
            } catch {
              return [user.username, []];
            }
          })
        );

        setResults(Object.fromEntries(resultEntries));
      } catch (err) {
        setError(
          "Could not load learners. Please check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLearnerProgress();
  }, []);

  const totalAssessments = Object.values(results).reduce(
    (total, attempts) => total + attempts.length,
    0
  );

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        <button
          onClick={() => navigate("/dashboard")}
          style={buttonStyle}
        >
          Back to Dashboard
        </button>

        <h1 style={{ marginTop: 30 }}>📊 Learner Progress</h1>

        <p style={{ color: "#667085" }}>
          Review learners and their assessment results.
        </p>

        {!loading && !error && (
          <div style={summaryStyle}>
            <div style={summaryCardStyle}>
              <p>Total Learners</p>
              <h2>{learners.length}</h2>
            </div>

            <div style={summaryCardStyle}>
              <p>Assessments Completed</p>
              <h2>{totalAssessments}</h2>
            </div>
          </div>
        )}

        {loading && <p>Loading learner results...</p>}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {!loading && !error && learners.length === 0 && (
          <p>No learner accounts found.</p>
        )}

        {!loading && !error && learners.map((learner) => {
          const attempts = results[learner.username] || [];

          return (
            <section
              key={learner.id || learner.username}
              style={cardStyle}
            >
              <h2>{learner.username}</h2>

              <p style={{ color: "#667085" }}>
                {learner.email}
              </p>

              <p>
                <strong>Assessments completed:</strong>{" "}
                {attempts.length}
              </p>

              {attempts.length === 0 ? (
                <p style={{ color: "#667085" }}>
                  No assessments completed yet.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>Topic</th>
                        <th style={cellStyle}>Score</th>
                        <th style={cellStyle}>Performance</th>
                        <th style={cellStyle}>Attempted At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attempts.map((attempt, index) => (
                        <tr key={attempt.id || index}>
                          <td style={cellStyle}>
                            {attempt.topic || "N/A"}
                          </td>

                          <td style={cellStyle}>
                            {attempt.percentage ?? 0}%
                          </td>

                          <td style={cellStyle}>
                            {attempt.performance
                              ?.replaceAll("_", " ") || "N/A"}
                          </td>

                          <td style={cellStyle}>
                            {attempt.attemptedAt
                              ? new Date(
                                  attempt.attemptedAt
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: 30,
  background: "#f4f6fc",
  fontFamily: "Arial, sans-serif",
  color: "#172033",
  boxSizing: "border-box"
};

const mainStyle = {
  maxWidth: 1100,
  margin: "auto"
};

const buttonStyle = {
  padding: "11px 18px",
  background: "#172033",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const summaryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 25
};

const summaryCardStyle = {
  background: "white",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 8px 25px #17203310"
};

const cardStyle = {
  background: "white",
  padding: 25,
  marginTop: 25,
  borderRadius: 18,
  boxShadow: "0 8px 25px #17203310"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const cellStyle = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap"
};

export default LearnerProgress;