import pg from 'pg';
import dotenv from 'dotenv';

// Aseguramos la carga de variables de entorno en este módulo
dotenv.config();

const { Pool } = pg;

/**
 * CONFIGURACIÓN DEL POOL DE CONEXIONES (EL CLAN DB)
 * Utilizamos Pool en lugar de Client para manejar múltiples conexiones
 * simultáneas de forma eficiente en producción.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Configuración de seguridad para despliegues en la nube (Heroku, Render, AWS)
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  // Límites del Pool para no saturar los planes gratuitos/básicos de Postgres
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificación de conexión inicial
pool.on('connect', () => {
  console.log('[DB] Nueva conexión establecida con la base de datos central.');
});

pool.on('error', (err) => {
  console.error('[DB-ERROR] Error inesperado en el cliente de Postgres:', err);
  process.exit(-1);
});

export default pool;
