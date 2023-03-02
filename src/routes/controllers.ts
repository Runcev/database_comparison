import { Request, Response } from "express";
import { executeQueryAndCompare } from "../utils";

export const productsSoldAmount = async (req: Request, res: Response) => {
  const result = await executeQueryAndCompare(
    "SELECT COUNT(*) AS total_products_sold FROM products_bills",
    ""
  );

  const { sql: { time: sqlTime }, vertica: { time: verticaTime } } = result;

  return res.json({
    sqlTime,
    verticaTime,
    timeDifference: Math.abs(sqlTime - verticaTime),
    result: result.sql.result
  })
};
