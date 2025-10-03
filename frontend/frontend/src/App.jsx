import { useState } from "react";

function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Mensagem enviada com sucesso!");
      } else {
        setStatus("Erro: " + data.error);
      }
    } catch (err) {
      setStatus("Falha ao enviar mensagem.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Contato - Viveiro Comurg</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <br />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <br />
        <textarea name="message" placeholder="Mensagem" value={form.message} onChange={handleChange} required />
        <br />
        <button type="submit">Enviar</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default App;
