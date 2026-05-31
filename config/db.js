import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:CPGJuintTchXaeQXUJHiLlFlGRlOgxUC@zephyr.proxy.rlwy.net:45349/railway",
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
