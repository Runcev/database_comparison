import verticaClient from "./config";

export const initializeVerticaDatabase = async () => {
    await verticaClient.connect();
    await verticaClient.query("SELECT store_city FROM store.store_dimension", async (err: any, res: { rows: any[] }) => {
    //await verticaClient.query("CREATE SCHEMA IF NOT EXISTS shop", async (err: any, res: { rows: any[] }) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log(res.rows)
          /*  await verticaClient.query(createResumesTableQuery, async (err: { message: any; }) => {
                if (err) {
                    console.error(err.message);
                } else {
                    await verticaClient.query(getFillResumesTableQuery(resumes));
                }
            });*/
        }
        await verticaClient.end()
    })
}
