import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then(setMessage);
  }, []);

  return <h1>{message}</h1>;
}

export default App
