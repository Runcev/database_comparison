import express from 'express';
import mySqlConnection from "./mysql/config";
import { generateBills, generateProductsBills, generateProductsStores } from "./common/data";
import { clearSqlDatabase, initializeSqlDatabase } from "./mysql/utils";

const app = express();
const PORT = 3000;

mySqlConnection.connect((err) => {
    if (err) throw err;
});

console.log(generateProductsStores());
console.log(generateBills());
console.log(generateProductsBills(40, 40, 20).reverse());

app.get("/", async (req, res) => {
});

app.listen(PORT, async () => {
    console.log("Server is listening on port ", PORT);
    await clearSqlDatabase();
    await initializeSqlDatabase();
});
