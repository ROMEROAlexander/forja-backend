import pool from '../config/db.js';

/**
 * SEMBRADOR DE "EL CLAN"
 * Propósito: Poblar la DB con el contenido inicial para que el MVP sea funcional 
 * desde el segundo cero.
 */
const seedDatabase = async () => {
  try {
    console.log('[SIEMBRA] Iniciando carga de datos iniciales...');

    // 1. Insertar Usuario Maestro (El Cid)
    const cidQuery = `
      INSERT INTO usuarios (nombre, email, rango, puntos_forja)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING;
    `;
    await pool.query(cidQuery, ['Rodrigo (El Cid)', 'alexromero.sv@gmail.com', 'Campeador', 1000]);

    // 2. Insertar Rutina de Escudero - Día 1 (Enfoque Articular 40+)
    const rutinaQuery = `
      INSERT INTO rutinas (nombre, descripcion, ejercicios, dosis_estoica_sugerida, dificultad)
      VALUES ($1, $2, $3, $4, $5);
    `;
    
    const ejerciciosEscudero = JSON.stringify([
      { nombre: "Movilidad de Cadera (90/90)", series: 2, repeticiones: "1 min por lado", notas: "Prepara las bases." },
      { nombre: "Flexiones con manos elevadas", series: 3, repeticiones: "10-12", notas: "Protección absoluta de hombros." },
      { nombre: "Sentadilla de Copa (Goblet)", series: 3, repeticiones: "15", notas: "Carga ligera, espalda recta." },
      { nombre: "Puente de Glúteo", series: 3, repeticiones: "20", notas: "Estabilidad lumbar para evitar dolores." }
    ]);

    await pool.query(rutinaQuery, [
      'Bautismo del Escudero',
      'Rutina diseñada para hombres 40+ que inician su sendero. Impacto cero, beneficio máximo.',
      ejerciciosEscudero,
      'No es que tengamos poco tiempo, sino que perdemos mucho. (Séneca)',
      'Baja'
    ]);

    console.log('[EXITO] El Clan ha sido sembrado. Datos de Escudero listos.');
    process.exit(0);
  } catch (error) {
    console.error('[FATAL] Fallo al sembrar el Clan:', error);
    process.exit(1);
  }
};

seedDatabase();
