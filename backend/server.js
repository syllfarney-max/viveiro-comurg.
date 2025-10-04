import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // permite requisições de qualquer origem enquanto debugamos
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY || ""); // NÃO imprima a chave

// Endpoint de DEBUG (não retorna a API key)
app.get("/debug", (req, res) => {
  res.json({
    contactEmail: process.env.CONTACT_EMAIL || null,
    sendGridKeySet: !!process.env.SENDGRID_API_KEY,
    debugEmail: process.env.DEBUG_EMAIL === "true" ? true : false,
  });
});

// handler único para envio (usado por /send e /api/contact)
async function sendHandler(req, res) {
  console.log(">>> Incoming request headers:", req.headers);
  console.log(">>> Incoming request body:", req.body);

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Campos obrigatórios faltando." });
  }

  const msg = {
    to: process.env.CONTACT_EMAIL,
    from: process.env.CONTACT_EMAIL, // OBRIGATÓRIO: email verificado no SendGrid
    subject: `Mensagem do site - ${name}`,
    text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    replyTo: email,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("SendGrid accepted response (summary):", Array.isArray(response) ? response[0]?.statusCode : response?.status);
    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (err) {
    // log completo no servidor (útil)
    console.error("SendGrid error (full):", err.response?.body ?? err);

    if (process.env.DEBUG_EMAIL === "true") {
      // retornar detalhes para eu poder interpretar (temporário)
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

app.post("/send", sendHandler);
app.post("/api/contact", sendHandler);

app.get("/", (req, res) => res.send("Backend do Viveiro Comurg rodando!"));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


