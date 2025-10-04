// frontend/src/components/ContactForm.jsx
import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || ""; // *** BUILT AT BUILD-TIME ***

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");
    console.log("DEBUG: API_BASE =", API_BASE);

    // Endpoints testados (tenta primeiro /send, depois /api/contact)
    const endpoints = [
      `${API_BASE}/send`,
      `${API_BASE}/api/contact`,
    ];

    let lastError = null;
    for (const url of endpoints) {
      try {
        console.log("Tentando POST em:", url);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const text = await res.text();
        // tenta parse se for JSON
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        console.log("Resposta do servidor:", res.status, data);

        if (res.ok && data.success) {
          setStatus("✅ Mensagem enviada com sucesso!");
          setForm({ name: "", email: "", message: "" });
          return;
        } else {
          lastError = { url, status: res.status, data };
          // continua tentando próximo endpoint
        }
      } catch (err) {
        console.error("Erro ao chamar", url, err);
        lastError = { url, error: String(err) };
      }
    }

    // se chegou aqui, falhou em todos
    console.error("Falha em todos endpoints testados:", lastError);
    setStatus("❌ Erro ao enviar mensagem. Veja console para detalhes.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <textarea name="message" placeholder="Mensagem" value={form.message} onChange={handleChange} required />
      <button type="submit">Enviar</button>
      <p>{status}</p>
    </form>
  );
}
