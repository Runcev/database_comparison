import express from "express";
import mySqlConnection from "./mysql/config";
import { clearSqlDatabase, initializeSqlDatabase } from "./mysql/utils";
import {
  clearVerticaDatabase,
  initializeVerticaDatabase,
} from "./vertica/utils";
import router from "./routes/router";

const app = express();
const PORT = 3000;

mySqlConnection.connect((err) => {
  if (err) throw err;
});

app.use(router);
app.get("/", async (req, res) => {
  return res.send("DATABASE_COMPARISON APPLICATION");
});

app.listen(PORT, async () => {
  await clearSqlDatabase();
  await initializeSqlDatabase();
  await clearVerticaDatabase();
  await initializeVerticaDatabase();
  console.log("Server is listening on port ", PORT);
});
