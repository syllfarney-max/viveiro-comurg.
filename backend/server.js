import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configura SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/contact", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    const msg = {
      to: process.env.CONTACT_EMAIL, // destinatário
      from: "syllfarney@hotmail.com", // altere aqui para o e-mail validado no SendGrid
      subject: `Nova mensagem de contato - ${nome}`,
      text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });

  } catch (error) {
    console.error("Erro ao enviar email:", error.response?.body || error.message || error);
    res.status(500).json({
      success: false,
      error: "Erro ao enviar mensagem. Veja logs para detalhes."
    });
  }
});

// Endpoint raiz só para não dar "Cannot GET /"
app.get("/", (req, res) => {
  res.send("API do Viveiro Comurg está rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
