import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config(); // carrega variáveis do .env

// Configura a API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configura a mensagem de teste
const msg = {
  to: process.env.CONTACT_EMAIL || "syllfarney@hotmail.com", // destinatário
  from: "syllfarney@hotmail.com", // remetente único já verificado
  subject: "🚀 Teste de envio - Viveiro Comurg",
  text: "Se você recebeu este email, o backend está funcionando com SendGrid!",
  html: "<strong>Se você recebeu este email, o backend está funcionando com SendGrid! ✅</strong>",
};

// Envia a mensagem
(async () => {
  try {
    await sgMail.send(msg);
    console.log("✅ Email de teste enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error.response?.body || error);
  }
})();
