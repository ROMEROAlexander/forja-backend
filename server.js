import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import initDatabase from './models/initQueries.js';
import forjaRoutes from './routes/forjaRoutes.js';

// Carga de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES (Seguridad y procesamiento de datos)
app.use(cors());
app.use(express.json());

// CONEXIÓN DE RUTAS
// Ahora todas tus funciones viven en forjaRoutes
app.use('/api', forjaRoutes);

// RUTA DE PRUEBA (Healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Motor de FORJA Activo', modo: 'Producción' });
});

// ARRANQUE DEL SISTEMA
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[FORJA-CORE] Motor activo en puerto ${port}. Listo para la batalla, Rodrigo.`);
  });
}).catch(err => {
  console.error('[CRÍTICO] Error al inicializar el Clan:', err);
});
