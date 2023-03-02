import { Request, Response } from "express";
import { executeQueryAndCompare, parseQueryExecutionResult } from "../utils";
import {
  getSqlEighthQuery,
  getSqlFifthQuery,
  getSqlFirstQuery,
  getSqlFourthQuery, getSqlNinthQuery,
  getSqlSecondQuery, getSqlSeventhQuery, getSqlSixthQuery,
  getSqlThirdQuery
} from "../mysql/utils";
import {
  getVerticaEighthQuery,
  getVerticaFifthQuery,
  getVerticaFirstQuery,
  getVerticaFourthQuery, getVerticaNinthQuery,
  getVerticaSecondQuery, getVerticaSeventhQuery, getVerticaSixthQuery,
  getVerticaThirdQuery
} from "../vertica/utils";

export const productsSoldAmount = async (req: Request, res: Response) => {
  const result = await executeQueryAndCompare(
    getSqlFirstQuery(),
    getVerticaFirstQuery(),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const priceSoldTotal = async (req: Request, res: Response) => {
  const result = await executeQueryAndCompare(
    getSqlSecondQuery(),
    getVerticaSecondQuery(),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const priceSoldTotalPeriod = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlThirdQuery(String(periodStart), String(periodEnd)),
    getVerticaThirdQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsSoldAmountStorePeriod = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlFourthQuery(String(periodStart), String(periodEnd)),
    getVerticaFourthQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsSoldAmountAllStoresPeriod = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlFifthQuery(String(periodStart), String(periodEnd)),
    getVerticaFifthQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsTotalRevenuePeriod = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlSixthQuery(String(periodStart), String(periodEnd)),
    getVerticaSixthQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsPairsTop10Period = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlSeventhQuery(String(periodStart), String(periodEnd)),
    getVerticaSeventhQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsTripletsTop10Period = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlEighthQuery(String(periodStart), String(periodEnd)),
    getVerticaEighthQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};

export const productsQuadruplesTop10Period = async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.query;
  const result = await executeQueryAndCompare(
    getSqlNinthQuery(String(periodStart), String(periodEnd)),
    getVerticaNinthQuery(String(periodStart), String(periodEnd)),
  );

  return res.json(parseQueryExecutionResult(result));
};
