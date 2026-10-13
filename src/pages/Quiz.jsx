import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://learning-platform-backend-x13o.onrender.com";

function Quiz() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("uname");

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await axios.get(`${API}/materials`);
        const data = Array.isArray(response.data) ? response.data : [];

        setMaterials(data);

        if (data.length > 0) {
          setMaterialId(String(data[0].id));
          setMessage("Select a PDF and click Load Quiz.");
        } else {
          setMessage("No learning materials found. Upload a PDF first.");
        }
      } catch {
        setMessage("Unable to load materials. Check whether the backend is running.");
      } finally {
        setLoadingMaterials(false);
      }
    };

    loadMaterials();
  }, []);

  const loadQuestions = async () => {
    if (!materialId) {
      setMessage("Please select a PDF.");
      return;
    }

    setLoading(true);
    setMessage("");
    setQuestions([]);
    setAnswers({});
    setResult(null);

    try {
      const response = await axios.get(
        `${API}/quiz/material/${materialId}`
      );

      const data = Array.isArray(response.data) ? response.data : [];
      setQuestions(data);

      if (data.length === 0) {
        setMessage(
          "No quiz questions found for this PDF. Generate its AI quiz first."
        );
      }
    } catch {
      setMessage("Unable to load questions. Check the backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer
    }));
  };

  const submitQuiz = async () => {
    if (!username) {
      setMessage("Please log in before submitting the assessment.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      setMessage("Please answer every question before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const selectedMaterial = materials.find(
        (material) => String(material.id) === materialId
      );

      const response = await axios.post(`${API}/assessment/submit`, {
        username,
        materialId: Number(materialId),
        topic: selectedMaterial?.topic || "",
        answers
      });

      setResult(response.data);
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to submit the assessment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "#172033",
    color: "white",
    cursor: "pointer",
    fontSize: "15px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
        color: "#172033",
        paddingBottom: "50px"
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
          padding: "15px 6%",
          gap: "15px",
          flexWrap: "wrap"
        }}
      >
        <h2 style={{ margin: 0 }}>LearnAI</h2>
        <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
          Dashboard
        </button>
      </nav>

      <main style={{ maxWidth: "950px", margin: "40px auto", padding: "0 20px" }}>
        <h1>Knowledge Assessment</h1>
        <p style={{ color: "#667085", lineHeight: 1.6 }}>
          Test your knowledge and identify your competency level.
        </p>

        <section
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "18px",
            marginTop: "25px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.07)"
          }}
        >
          <label
            htmlFor="material"
            style={{ display: "block", fontWeight: "600", marginBottom: "12px" }}
          >
            Select Learning PDF ({materials.length} available)
          </label>

          <select
            id="material"
            value={materialId}
            onChange={(event) => {
              setMaterialId(event.target.value);
              setQuestions([]);
              setAnswers({});
              setResult(null);
              setMessage("");
            }}
            disabled={loadingMaterials || loading || materials.length === 0}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
              background: "white",
              boxSizing: "border-box"
            }}
          >
            <option value="">Select a PDF</option>
            {materials.map((material) => (
              <option key={material.id} value={String(material.id)}>
                {material.title} — {material.topic} (ID: {material.id})
              </option>
            ))}
          </select>

          <button
            onClick={loadQuestions}
            disabled={loadingMaterials || loading || !materialId}
            style={{
              ...buttonStyle,
              marginTop: "18px",
              opacity: loadingMaterials || loading || !materialId ? 0.6 : 1
            }}
          >
            {loadingMaterials
              ? "Loading PDFs..."
              : loading
                ? "Please wait..."
                : "Load Quiz"}
          </button>
        </section>

        {message && (
          <p
            role="status"
            style={{
              background: "#fff1f0",
              color: "#b42318",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "25px",
              lineHeight: 1.5
            }}
          >
            {message}
          </p>
        )}

        {loading && (
          <p style={{ textAlign: "center", marginTop: "25px" }}>
            Please wait...
          </p>
        )}

        {!loading && questions.map((question, index) => (
          <section
            key={question.id}
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "18px",
              marginTop: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.07)"
            }}
          >
            <h3 style={{ lineHeight: 1.6 }}>
              {index + 1}. {question.question}
            </h3>

            {[
              ["A", question.optionA],
              ["B", question.optionB],
              ["C", question.optionC],
              ["D", question.optionD]
            ].map(([letter, option]) => (
              <label
                key={letter}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "14px",
                  marginTop: "10px",
                  border: answers[question.id] === letter
                    ? "1px solid #172033"
                    : "1px solid #e5e7eb",
                  background: answers[question.id] === letter
                    ? "#f0f3f9"
                    : "white",
                  borderRadius: "10px",
                  cursor: "pointer",
                  lineHeight: 1.5
                }}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={letter}
                  checked={answers[question.id] === letter}
                  disabled={Boolean(result) || loading}
                  onChange={() => handleAnswer(question.id, letter)}
                  style={{ marginTop: "4px" }}
                />
                <span><strong>{letter}.</strong> {option}</span>
              </label>
            ))}
          </section>
        ))}

        {questions.length > 0 && !result && (
          <button
            onClick={submitQuiz}
            disabled={loading}
            style={{
              ...buttonStyle,
              display: "block",
              margin: "30px auto",
              padding: "15px 35px",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Submitting..." : "Submit Assessment"}
          </button>
        )}

        {result && (
          <section
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "20px",
              marginTop: "30px",
              textAlign: "center",
              boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
            }}
          >
            <h2>Assessment Completed!</h2>
            <h1 style={{ fontSize: "48px" }}>
              {Number(result.percentage).toFixed(2)}%
            </h1>
            <p>
              Correct Answers: {result.correctAnswers} / {result.totalQuestions}
            </p>
            <p>Performance: <strong>{result.performance}</strong></p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ ...buttonStyle, marginTop: "20px" }}
            >
              Back to Dashboard
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Quiz;
