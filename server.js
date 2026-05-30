/*
  SERVER.JS - EL MOTOR CENTRAL DE FORJA
  Este archivo coordina las rutas, la base de datos y los middlewares.
*/
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

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS DEL SISTEMA
// Conectamos todas las rutas que definimos en forjaRoutes bajo el prefijo /api
app.use('/api', forjaRoutes);

// RUTA DE SALUD (Para verificar que el motor vive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Fuertes y Firmes', timestamp: new Date() });
});

// ARRANQUE E INICIALIZACIÓN
// Primero inicializamos la DB (Crea tablas si no existen) y luego levantamos el servidor
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[FORJA-CORE] Motor activo en puerto ${port}. Listo para la batalla, Rodrigo.`);
  });
}).catch(err => {
  console.error('[CRÍTICO] El Clan no pudo inicializar la base de datos:', err);
});
