import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configura SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("✅ Backend do Viveiro Comurg rodando!");
});

// Rota de contato
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios."
      });
    }

    const msg = {
      to: process.env.CONTACT_EMAIL, // destinatário (seu email verificado no SendGrid)
      from: process.env.CONTACT_EMAIL, // remetente (precisa ser verificado no SendGrid)
      subject: `📩 Nova mensagem do site - ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`,
      html: `
        <h3>Nova mensagem do site</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email // para poder responder direto ao usuário
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso!"
    });

  } catch (error) {
    console.error("❌ Erro ao enviar email:", error.response?.body || error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar mensagem. Verifique se o remetente está verificado no SendGrid."
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
