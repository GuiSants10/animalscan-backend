import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.get("/", (req, res) => {
  res.send("AnimalScan backend online 🕷️");
});

app.post("/identify", upload.single("photo"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer.toString("base64");
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      { inputs: imageBuffer },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );
    const result = response.data[0][0];
    res.json({
      nome: result.label,
      confiança: (result.score * 100).toFixed(2) + "%"
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao identificar o animal" });
  }
});

app.listen(3000, () => console.log("✅ AnimalScan backend ativo na porta 3000"));
