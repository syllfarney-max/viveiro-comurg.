import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const msg = {
    to: process.env.CONTACT_EMAIL || "syllfarney@hotmail.com",
    from: "syllfarney@hotmail.com",
    subject: `Novo contato de ${name}`,
    text: `Email: ${email}\nMensagem: ${message}`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar mensagem." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
