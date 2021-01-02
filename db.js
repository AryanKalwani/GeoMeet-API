const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "abcd1234",
    database: "geomeetdb",
    host: "localhost",
    port: 5432
});

module.exports = pool;