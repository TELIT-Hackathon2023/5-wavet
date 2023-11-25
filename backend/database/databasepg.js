const { Client } = require("pg")

const client = new Client({
    host: "147.232.39.18",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "postgres"

})

module.exports = client

