const { Client } = require('vertica-nodejs')
const verticaClient = new Client({
    user: "dbadmin",
    host: "localhost",
    database: "VMart",
    port: 5433,
})

export default verticaClient