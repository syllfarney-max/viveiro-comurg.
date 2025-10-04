// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // permite requisições do front
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// handler único, usado por /send e /api/contact
async function sendHandler(req, res) {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Campos obrigatórios faltando." });
  }

  const msg = {
    to: process.env.CONTACT_EMAIL,
    from: process.env.CONTACT_EMAIL, // OBRIGATÓRIO: use o e-mail verificado no SendGrid
    subject: `Mensagem do site - ${name}`,
    text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    replyTo: email
  };

  try {
    await sgMail.send(msg);
    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (err) {
    // log completo no servidor
    console.error("SendGrid error (full):", err.response?.body ?? err);

    // responder com detalhes APENAS se DEBUG_EMAIL=true (não exponha erros em produção)
    if (process.env.DEBUG_EMAIL === "true") {
      return res.status(500).json({
        success: false,
        error: "Erro ao enviar mensagem",
        sendgrid: err.response?.body ?? String(err)
      });
    } else {
      return res.status(500).json({ success: false, error: "Erro ao enviar mensagem." });
    }
  }
}

app.post("/send", sendHandler);
app.post("/api/contact", sendHandler);

app.get("/", (req, res) => res.send("Backend do Viveiro Comurg rodando!"));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

