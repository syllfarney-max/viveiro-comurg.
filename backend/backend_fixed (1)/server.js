
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";

const app = express();
const PORT = process.env.PORT || 10000;

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend do Viveiro Comurg rodando!");
});

// Rota de envio de e-mail
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const msg = {
      to: process.env.CONTACT_EMAIL, // destinatário
      from: process.env.CONTACT_EMAIL, // remetente verificado
      subject: `Mensagem do site - ${name}`,
      text: `
        Nome: ${name}
        Email: ${email}
        Mensagem: ${message}
      `,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `,
      replyTo: email
    };

    await sgMail.send(msg);
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.response?.body || error.message);
    res.status(500).json({ success: false, error: "Erro ao enviar mensagem." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
