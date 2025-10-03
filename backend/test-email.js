import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.CONTACT_EMAIL, // destino = mesmo e-mail verificado no SendGrid
  from: process.env.CONTACT_EMAIL, // remetente = obrigatoriamente e-mail verificado no SendGrid
  subject: "Teste de envio - Viveiro Comurg",
  text: "Se você recebeu este e-mail, o envio está funcionando!",
};

async function sendTest() {
  try {
    await sgMail.send(msg);
    console.log("✅ E-mail enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro completo no envio:");
    if (error.response && error.response.body) {
      console.error(error.response.body); // mostra detalhes da API do SendGrid
    } else {
      console.error(error.message);
    }
  }
}

sendTest();
