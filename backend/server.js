import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// rota principal (corrigido)
app.get("/", (req, res) => {
  res.json({ message: "Backend do Viveiro Comurg está rodando 🚀" });
});

// rota do formulário
app.post("/contato", (req, res) => {
  res.json({ success: true, data: req.body });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
