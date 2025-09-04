import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}

function Dashboard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const token = localStorage.getItem("token");

  const fetchFlashcards = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/flashcards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleAdd = async () => {
    if (!question || !answer) return alert("Please fill in both fields");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/flashcards",
        { question, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlashcards([...flashcards, res.data]);
      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/flashcards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards(flashcards.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleAIGenerate = async () => {
    if (!aiText && !aiFile) {
      return alert("Please provide text or upload a file");
    }

    try {
      setLoadingAI(true);

      const formData = new FormData();
      if (aiText) formData.append("text", aiText);
      if (aiFile) formData.append("file", aiFile);

      const res = await axios.post("http://localhost:5000/api/ai-flashcards", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Append AI-generated cards to state
      setFlashcards([...flashcards, ...res.data]);
      setAiText("");
      setAiFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate flashcards");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>📚 Flashcard Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Manual Flashcard Add */}
      <section className="add-card">
        <h2>Add a New Flashcard</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={handleAdd}>➕ Add Flashcard</button>
        </div>
      </section>

      {/* AI Flashcard Generator */}
      <section className="ai-card">
        <h2>✨ Generate Flashcards with AI</h2>
        <textarea
          placeholder="Paste some text here..."
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
        />
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setAiFile(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={handleAIGenerate} disabled={loadingAI}>
          {loadingAI ? "Generating..." : "🤖 Generate Flashcards"}
        </button>
      </section>

      {/* Flashcards List */}
      <section className="cards">
        <h2>Your Flashcards</h2>
        {flashcards.length === 0 ? (
          <p>No flashcards yet. Start adding some!</p>
        ) : (
          <div className="card-grid">
            {flashcards.map((f) => (
              <div key={f._id} className="card">
                <p><strong>Q:</strong> {f.question}</p>
                <p><strong>A:</strong> {f.answer}</p>
                <button onClick={() => handleDelete(f._id)}>🗑 Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
