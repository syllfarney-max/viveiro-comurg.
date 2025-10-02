import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sendgrid from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(bodyParser.json());

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendgrid.send({
      to: process.env.CONTACT_EMAIL,
      from: process.env.CONTACT_EMAIL,
      subject: `Mensagem de ${name}`,
      text: `Email: ${email}\n\nMensagem:\n${message}`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao enviar mensagem." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
