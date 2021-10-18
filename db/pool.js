require('dotenv').config();
const { Pool } = require('pg');
const connectionInfo = process.env.PSGLURI || `postgres://postgres:19021991@localhost:5432/capstone`;
const pool = new Pool({ connectionString: connectionInfo });

module.exports = pool;