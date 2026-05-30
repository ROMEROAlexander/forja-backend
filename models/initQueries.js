import pool from '../config/db.js';

/**
 * ESQUEMA DE BASE DE DATOS - FORJA CORE
 * Propósito: Inicializar las tablas relacionales para el MVP.
 * Estructura pensada para escalabilidad y bajo consumo de recursos.
 */
const initDbSchema = async () => {
  const queryText = `
    -- 1. TABLA DE USUARIOS (EL CLAN)
    -- Almacena la identidad, el rango místico y el progreso acumulado.
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      rango VARCHAR(20) DEFAULT 'Escudero', -- Escudero -> Caballero -> Campeador
      puntos_forja INTEGER DEFAULT 0,
      avatar_url TEXT,
      fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. TABLA DE RUTINAS
    -- Contiene los sistemas de entrenamiento híbridos (calistenia + pesas).
    CREATE TABLE IF NOT EXISTS rutinas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      ejercicios JSONB NOT NULL, -- [{ejercicio: 'Dominadas', series: 3, reps: 8}]
      nivel_requerido VARCHAR(20) DEFAULT 'Escudero',
      activo BOOLEAN DEFAULT TRUE,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. TABLA DE DOSIS ESTOICA (REGISTRO HISTÓRICO)
    -- Para que las frases no se pierdan en el tiempo.
    CREATE TABLE IF NOT EXISTS dosis_estoicas (
      id SERIAL PRIMARY KEY,
      cita TEXT NOT NULL,
      autor VARCHAR(100),
      reflexion TEXT,
      reto_fisico TEXT,
      fecha_publicacion DATE UNIQUE DEFAULT CURRENT_DATE
    );

    -- 4. TABLA DE PROGRESO (VICTORIAS)
    -- El núcleo del diario de entrenamiento y salud articular 40+.
    CREATE TABLE IF NOT EXISTS progreso (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
      rutina_id INTEGER REFERENCES rutinas(id) ON DELETE SET NULL,
      mision_cumplida BOOLEAN DEFAULT FALSE,
      puntos_obtenidos INTEGER DEFAULT 0,
      peso_levantado_kg DECIMAL(10,2) DEFAULT 0, -- Registro de carga para progresión
      notas_reflexion TEXT, -- El diario estoico post-entreno
      alerta_dolor VARCHAR(50) DEFAULT 'Ninguna', -- Seguimiento de salud articular
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const res = await pool.query(queryText);
    console.log('[SISTEMA] Tablas de FORJA (Usuarios, Rutinas, Progreso) verificadas con éxito.');
    return res;
  } catch (err) {
    console.error('[DATABASE-ERROR] Fallo crítico al inicializar tablas:', err.message);
    throw err;
  }
};

export default initDbSchema;
