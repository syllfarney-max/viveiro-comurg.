import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  // IMPORTANTE: VITE_API_URL é injetada no build. Se estiver vazia neste build,
  // o fallback abaixo usa a URL que você já informou.
  const API_BASE = import.meta.env.VITE_API_URL || "https://viveiro-comurg-backend-34cj.onrender.com";

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");
    console.log("DEBUG: API_BASE =", API_BASE);

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
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        console.log("Resposta do servidor (status):", res.status, "body:", data);

        if (res.ok && data.success) {
          setStatus("✅ Mensagem enviada com sucesso!");
          setForm({ name: "", email: "", message: "" });
          return;
        } else {
          lastError = { url, status: res.status, data };
        }
      } catch (err) {
        console.error("Erro ao chamar", url, err);
        lastError = { url, error: String(err) };
      }
    }

    console.error("Falha em todos endpoints testados:", lastError);
    setStatus("❌ Erro ao enviar mensagem. Veja console (F12) e cole aqui a saída.");
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
