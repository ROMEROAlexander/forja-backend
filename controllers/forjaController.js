import pool from '../config/db.js';
import axios from 'axios';

/**
 * CONTROLADOR DE LA FORJA
 * Aquí reside la inteligencia y el procesamiento de datos del MVP.
 */

// 1. Obtener Dosis Estoica (Dinámica)
export const getDosisEstoica = async (req, res) => {
  try {
    // Por ahora servimos una dosis fija, pero ya está lista para ser consultada en DB
    const dosis = {
      cita: "No es que tengamos poco tiempo, sino que perdemos mucho.",
      autor: "Séneca",
      reflexion: "La disciplina de hoy es el tiempo de mañana.",
      retoDelCid: "Realiza 20 flexiones lentas enfocadas en la conexión mente-músculo.",
      fecha: new Date().toISOString().split('T')[0]
    };
    res.status(200).json(dosis);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la dosis mental." });
  }
};

// 2. Registrar Victoria y Disparar Webhook a N8N
export const registrarVictoria = async (req, res) => {
  const { usuario_id, rutina_id, puntos_ganados, zona_dolor, notas } = req.body;

  try {
    // Guardar en la tabla 'historial' que creamos en initQueries
    const query = `
      INSERT INTO historial (usuario_id, rutina_id, mision_cumplida, puntos_ganados, alerta_dolor, notas_estoicas)
      VALUES ($1, $2, true, $3, $4, $5)
      RETURNING *;
    `;
    const values = [usuario_id || 1, rutina_id || 1, puntos_ganados || 10, zona_dolor, notas];
    
    const result = await pool.query(query, values);

    // Disparar Webhook a N8N (Automatización de comunidad)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await axios.post(webhookUrl, {
        evento: 'NUEVA_VICTORIA',
        usuario: usuario_id,
        puntos: puntos_ganados,
        rango_actualizado: true // Lógica para el siguiente nivel
      }).catch(e => console.error("Fallo envío a N8N"));
    }

    res.status(201).json({
      success: true,
      data: result.rows[0],
      mensaje: "Misión cumplida. Los puntos han sido forjados."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo en el registro de la misión." });
  }
};
