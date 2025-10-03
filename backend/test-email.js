import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.CONTACT_EMAIL,
  from: process.env.CONTACT_EMAIL,
  subject: "Teste de envio de e-mail",
  text: "Se você recebeu esta mensagem, o SendGrid está funcionando corretamente.",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("E-mail de teste enviado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao enviar e-mail de teste:", error.response ? error.response.body : error.message);
  });
