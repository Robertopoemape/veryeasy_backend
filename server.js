const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta POST para generar diseño
app.post("/api/generar-diseno", (req, res) => {
  const { precio, cantidad, descripcion, modelo } = req.body;

  // Simulamos respuesta con imagen generada
  const imageUrl = `https://via.placeholder.com/600x400?text=Precio:+$${precio}+-+Caja:+${cantidad}+u.`;

  res.json({
    imagenUrl: imageUrl,
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});
