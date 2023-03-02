import express from 'express';
import mySqlConnection from "./mysql/config";
import { generateBills, generateProductsBills, generateProductsStores } from "./common/data";
import { clearSqlDatabase, initializeSqlDatabase } from "./mysql/utils";
import {clearVerticaDatabase, initializeVerticaDatabase, verticaQueryExecution} from "./vertica/utils";

const app = express();
const PORT = 3000;

mySqlConnection.connect((err) => {
    if (err) throw err;
});


app.get("/", async (req, res) => {
    const result = await verticaQueryExecution()
    return res.json({status: "success"})
});

app.listen(PORT, async () => {
    console.log("Server is listening on port ", PORT);
    await clearSqlDatabase();
    await initializeSqlDatabase();
    await clearVerticaDatabase();
    await initializeVerticaDatabase();
    /*setTimeout(async () => {
        await verticaQueryExecution();
    }, 2000)*/
});
