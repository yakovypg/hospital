const Pool = require('pg').Pool;
const { PORT_POSTGRES } = require('../config');

const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: PORT_POSTGRES,
    database: 'hospital_db',
});

module.exports = pool;
