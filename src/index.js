var Client = require('vertica-nodejs');
var client = new Client({
    user: process.env['V_USER'],
    host: process.env['V_HOST'],
    database: process.env['V_DATABASE'],
    password: process.env['V_PASSWORD'],
    port: process.env['V_PORT'],
});
client.connect();
client.query("SELECT 'success' as connectionWithConfig", function (err, res) {
    console.log(err || res.rows[0]);
    client.end();
});
//# sourceMappingURL=index.js.map