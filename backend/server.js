import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const msg = {
    to: process.env.CONTACT_EMAIL,
    from: process.env.CONTACT_EMAIL,
    subject: `Mensagem do site - ${name}`,
    text: `
      Nome: ${name}
      Email: ${email}
      Mensagem: ${message}
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.response ? error.response.body : error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar mensagem" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
