import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rota raiz para checar status
app.get("/", (req, res) => {
  res.send("✅ Backend está rodando!");
});

// Rota de contato
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await sgMail.send({
      to: process.env.CONTACT_EMAIL,
      from: process.env.CONTACT_EMAIL, // remetente único verificado
      subject: `Nova mensagem de ${name}`,
      text: `Email: ${email}

Mensagem:
${message}`,
    });
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro no envio:", error.response?.body || error);
    res.status(500).json({ success: false, error: "Erro ao enviar mensagem." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
