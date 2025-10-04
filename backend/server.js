import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

// Endpoint de debug (checar variáveis de ambiente)
app.get("/debug", (req, res) => {
  res.json({
    contactEmail: process.env.CONTACT_EMAIL || null,
    sendGridKeySet: !!process.env.SENDGRID_API_KEY,
    debugEmail: process.env.DEBUG_EMAIL === "true",
  });
});

// Função para envio de emails
async function sendHandler(req, res) {
  console.log("📩 Requisição recebida em /send ou /api/contact");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Campos obrigatórios faltando." });
  }

  const msg = {
    to: process.env.CONTACT_EMAIL,
    from: process.env.CONTACT_EMAIL, // precisa ser verificado no SendGrid
    subject: `Mensagem do site - ${name}`,
    text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    replyTo: email,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ SendGrid resposta:", response[0]?.statusCode);
    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro SendGrid:", err.response?.body ?? err);

    if (process.env.DEBUG_EMAIL === "true") {
      return res.status(500).json({
        success: false,
        error: "Erro ao enviar mensagem (DEBUG).",
        sendgrid: err.response?.body ?? String(err),
      });
    } else {
      return res.status(500).json({ success: false, error: "Erro ao enviar mensagem." });
    }
  }
}

// Rotas principais
app.post("/send", sendHandler);
app.post("/api/contact", sendHandler);

// Home
app.get("/", (req, res) => res.send("✅ Backend do Viveiro Comurg rodando!"));

// Start server
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));




