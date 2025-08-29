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
  const [notes, setNotes] = useState(""); // for AI text input
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // for AI file upload

  const token = localStorage.getItem("token");

  // Fetch flashcards
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

  // Manual add flashcard
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

  // Delete flashcard
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // AI: Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
  };

  // AI: Generate flashcards from file
  const handleFileGenerate = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFlashcards([...flashcards, ...res.data]);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  // AI: Generate flashcards from text notes
  const handleTextSubmit = async () => {
    if (!notes) return alert("Enter notes first!");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/text",
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlashcards([...flashcards, ...res.data]);
      setNotes("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>📚 Flashcard Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* AI Flashcard Generation */}
      <section className="ai-section">
        <h2>Generate Flashcards with AI</h2>
        <div className="ai-inputs">
          {/* File Upload */}
          <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileGenerate}>Generate from File</button>
          </div>

          {/* Notes Input */}
          <div>
            <textarea
              placeholder="Or paste your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button onClick={handleTextSubmit}>Generate from Notes</button>
          </div>
        </div>
      </section>

      {/* Manual Flashcard Form */}
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

      {/* Flashcards Grid */}
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
