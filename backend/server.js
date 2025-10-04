import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser"; 
import sgMail from "@sendgrid/mail"; 
 
const app = express(); 
 
app.use(cors()); 
app.use(bodyParser.json()); 
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
 
app.get("/", (req, res) =
  res.send("✅ Backend do Viveiro Comurg rodando!"); 
}); 
 
app.post("/send", async (req, res) =
  const { name, email, message } = req.body; 
    return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." }); 
  } 
 
  const msg = { 
    to: process.env.CONTACT_EMAIL, 
    from: process.env.CONTACT_EMAIL, 
    subject: "🌱 Novo contato - " + name, 
    text: "Nome: " + name + "\nEmail: " + email + "\nMensagem: " + message 
  }; 
 
  try { 
    await sgMail.send(msg); 
    res.json({ success: true, message: "Mensagem enviada com sucesso!" }); 
  } catch (error) { 
    console.error("Erro:", error); 
    res.status(500).json({ success: false, error: "Erro ao enviar mensagem." }); 
  } 
}); 
 
app.listen(PORT, () = + PORT)); 
