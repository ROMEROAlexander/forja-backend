import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import pg from 'pg';

// Carga de variables de entorno (.env)
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES DE PRODUCCIÓN PREPARADOS PARA ESCALAR
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE BASE DE DATOS (EL CLAN)
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * RUTA: DOSIS ESTOICA DINÁMICA
 * GET /api/estoico
 * Propósito: Entrega la frase del día y el reto físico al frontend de FORJA.
 */
app.get('/api/estoico', (req, res) => {
  // En fase MVP, servimos la frase lógica desde el servidor para control total del fundador (Cid)
  const dosisDelDia = {
    cita: "No es que tengamos poco tiempo, sino que perdemos mucho.",
    autor: "Séneca",
    reflexion: "La brevedad de la vida es una ilusión. La disciplina hoy es lo que expande tu tiempo mañana para lo que realmente importa.",
    retoDelCid: "Realiza 3 series de 10 flexiones lentas (fase excéntrica de 3 segundos) para fortalecer tendones.",
    fecha_forja: new Date().toISOString().split('T')[0]
  };

  res.status(200).json(dosisDelDia);
});

/**
 * UTILIDAD: DISPARADOR DE WEBHOOKS (N8N)
 * Propósito: Envía datos de rendimiento a nuestra infraestructura de automatización sin latencia percibida.
 */
const enviarAN8N = async (trigger, payload) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn(`[AVISO] Webhook N8N no configurado. Evento '${trigger}' ignorado.`);
    return;
  }

  try {
    await axios.post(webhookUrl, {
      fuente: 'FORJA_BACKEND_PROD',
      evento: trigger,
      timestamp: new Date().toISOString(),
      data: payload
    });
    console.log(`[EXITO] Evento '${trigger}' sincronizado con N8N.`);
  } catch (error) {
    console.error(`[ERROR] Fallo al impactar N8N: ${error.message}`);
  }
};

/**
 * RUTA: REPORTE DE MISIÓN (VICTORIA)
 * POST /api/v1/victoria
 * Propósito: Registra el fin de una rutina y activa el flujo de N8N.
 */
app.post('/api/v1/victoria', async (req, res) => {
  const { usuario_id, rutina_id, puntos_ganados, zona_dolor } = req.body;

  try {
    // Espacio reservado para lógica de persistencia en PostgreSQL
    // await pool.query('INSERT INTO victorias ...');
    
    // Disparo inmediato a N8N para notificaciones de "El Clan" (Telegram/WhatsApp/Discord)
    await enviarAN8N('NUEVA_VICTORIA', {
      usuario_id,
      rutina_id,
      puntos_ganados,
      alerta_lesion: zona_dolor !== 'Ninguna' ? zona_dolor : false
    });

    res.status(201).json({
      status: 'success',
      mensaje: 'Victoria forjada y reportada al Clan.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en la forja de datos.' });
  }
});

// ARRANQUE DEL MOTOR - PORT 3000 OBLIGATORIO
app.listen(port, () => {
  console.log(`[FORJA-CORE] Motor activo en puerto ${port}. Listo para la batalla.`);
});
