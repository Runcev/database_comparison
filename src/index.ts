import express = require("express")
import {initializeVerticaDatabase} from "./vertica/utils";


const app = express();
const PORT = 3000;

initializeVerticaDatabase().then()

app.get("/", async (req, res) => {
});

app.listen(PORT, async () => {
    console.log("Server is listening on port ", PORT);
});
