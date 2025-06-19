const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/carreras", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "CARRERA"');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener carreras:", err.message, err.stack);
    res.status(500).json({ error: "Error al obtener carreras" });
  }
});


router.get("/malla/:idCarrera", async (req, res) => {
  const { idCarrera } = req.params;

  try {
    const result = await db.query(`
       SELECT 
        r.id_ramo,
        r.nombre_ramo AS nombre,
        r.semestre,
        COALESCE(
          ARRAY_AGG(rp.id_ramo_prerrequisito)
          FILTER (WHERE rp.id_ramo_prerrequisito IS NOT NULL),
          '{}'
        ) AS prerrequisitos
      FROM "RAMO" r
      LEFT JOIN "RAMO_PRERREQUISITO" rp ON r.id_ramo = rp.id_ramo
      INNER JOIN "MALLA" m ON r.id_malla = m.id_malla
      WHERE m.id_carrera = $1 AND r.id_malla = $1
      GROUP BY r.id_ramo, r.nombre_ramo, r.semestre
      ORDER BY r.semestre, r.nombre_ramo
    `,  [idCarrera]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener malla:", err.message, err.stack);
    res.status(500).json({ error: "Error al obtener malla" });
  }
});

module.exports = router;