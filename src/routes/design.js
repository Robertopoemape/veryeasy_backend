const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/generar-diseno", async (req, res) => {
  const { precio, cantidad, descripcion, modelo } = req.body;
  try {
    const response = await fetch(
      `https://api.canva.com/v1/external/templates/${process.env.TEMPLATE_ID}/render`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CANVA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Diseño - $${precio}`,
          dynamic_values: {
            txt_precio: `$${precio}`,
            txt_cantidad: `${cantidad} unidades`,
            txt_descripcion: descripcion,
          },
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    res.json({ imagenUrl: data.export_url });
  } catch (error) {
    console.error("Error en /api/generar-diseno:", error);
    res
      .status(500)
      .json({ error: "Error al generar diseño", details: error.message });
  }
});

module.exports = router;
