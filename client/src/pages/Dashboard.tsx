import { useEffect, useState } from "react";
import axios from "axios";

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}

function Dashboard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

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

  // Create a flashcard
  const handleAdd = async () => {
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

  // Delete a flashcard
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

  return (
    <div>
      <h2>Dashboard</h2>

      <div>
        <h3>Add Flashcard</h3>
        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div>
        <h3>Your Flashcards</h3>
        {flashcards.map((f) => (
          <div key={f._id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
            <strong>Q:</strong> {f.question} <br />
            <strong>A:</strong> {f.answer} <br />
            <button onClick={() => handleDelete(f._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
