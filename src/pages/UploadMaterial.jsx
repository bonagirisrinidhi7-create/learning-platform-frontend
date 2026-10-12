import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadMaterial() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [materialId, setMaterialId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("topic", topic);
    data.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      setMaterialId(null);

      const response = await axios.post(
        "http://localhost:8080/materials/upload",
        data
      );

      setMaterialId(response.data);
      setMessage(`PDF uploaded successfully! Material ID: ${response.data}`);
      setFile(null);
      e.target.reset();
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Upload failed. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!materialId) return;

    try {
      setGenerating(true);
      setMessage("AI is generating questions. Please wait...");

      const response = await axios.post(
        `http://localhost:8080/ai/generate-quiz/${materialId}`
      );

      setMessage(
        `${response.data.message}. Questions generated: ${response.data.questionsGenerated}`
      );
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Quiz generation failed. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
        boxSizing: "border-box"
      }}
    >
      <button
        onClick={() => navigate("/dashboard")}
        style={buttonStyle}
      >
        Back to Dashboard
      </button>

      <div
        style={{
          maxWidth: "520px",
          margin: "45px auto",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
        }}
      >
        <h1 style={{ textAlign: "center", color: "#172033" }}>
          Upload Learning PDF
        </h1>

        <p style={{ textAlign: "center", color: "#667085", lineHeight: "1.6" }}>
          Upload study material and generate AI-powered quiz questions.
        </p>

        <form onSubmit={uploadFile}>
          <label>Material Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter material title"
            required
            style={inputStyle}
          />

          <label>Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Operating Systems"
            required
            style={inputStyle}
          />

          <label>Select PDF</label>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading || generating}
            style={{ ...buttonStyle, width: "100%", marginTop: "10px" }}
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>

        {materialId && (
          <button
            onClick={generateQuiz}
            disabled={generating}
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: "15px",
              background: "#176b45"
            }}
          >
            {generating ? "Generating Questions..." : "Generate AI Quiz"}
          </button>
        )}

        {message && (
          <p
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "8px",
              background: "#f0f4fa",
              overflowWrap: "anywhere",
              lineHeight: "1.5"
            }}
          >
            {message}
          </p>
        )}

        {materialId && (
          <button
            onClick={() => navigate("/quiz")}
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: "10px",
              background: "#344054"
            }}
          >
            Open Learner Quiz
          </button>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #d0d5dd",
  borderRadius: "9px",
  fontSize: "15px"
};

const buttonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "9px",
  background: "#172033",
  color: "white",
  cursor: "pointer"
};

export default UploadMaterial;