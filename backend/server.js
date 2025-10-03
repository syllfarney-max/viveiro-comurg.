import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// rota principal
app.get("/", (req, res) => {
  res.json({ message: "Backend do Viveiro Comurg está rodando 🚀" });
});

// rota do formulário de contato
app.post("/contato", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const msg = {
    to: process.env.CONTACT_EMAIL, // email que receberá
    from: process.env.CONTACT_EMAIL, // precisa ser verificado no SendGrid
    subject: `Nova mensagem de contato - ${nome}`,
    text: `
      Nome: ${nome}
      Email: ${email}
      Mensagem: ${mensagem}
    `,
    html: `
      <strong>Nome:</strong> ${nome}<br/>
      <strong>Email:</strong> ${email}<br/>
      <strong>Mensagem:</strong> ${mensagem}
    `,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem. Tente novamente mais tarde." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
