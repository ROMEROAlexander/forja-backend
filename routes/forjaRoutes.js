import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @route   GET /api/v1/perfil/:id
 * @desc    Obtiene los Puntos Forja y Rango actual del hombre (Cid/Escudero)
 */
router.get('/perfil/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT nombre, rango, puntos_forja FROM usuarios WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en el Clan.' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la base de datos.' });
  }
});

/**
 * @route   POST /api/v1/registro
 * @desc    Registra a un nuevo hombre en la hermandad (El Clan)
 */
router.post('/registro', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre, email]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Este guerrero ya está registrado en el Clan.' });
    } else {
      res.status(500).json({ error: 'Fallo en la forja del usuario.' });
    }
  }
});

/**
 * @route   GET /api/v1/rutinas
 * @desc    Lista las misiones disponibles para el día
 */
router.get('/rutinas', async (req, res) => {
  try {
    const rutinas = await pool.query('SELECT * FROM rutinas ORDER BY id ASC');
    res.json(rutinas.rows);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron recuperar las rutinas.' });
  }
});

export default router;
