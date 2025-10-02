import React, { useState } from 'react'

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      setStatus(data.message)
    } catch (error) {
      setStatus("Erro ao enviar mensagem.")
    }
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '2rem' }}>
      <h1>Viveiro Comurg</h1>
      <p>Software para gestão de viveiros florestais.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" onChange={handleChange} required /><br/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/>
        <textarea name="message" placeholder="Mensagem" onChange={handleChange} required></textarea><br/>
        <button type="submit">Enviar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default App
