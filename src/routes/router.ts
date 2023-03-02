import express from "express";
import {
  priceSoldTotal,
  priceSoldTotalPeriod,
  productsPairsTop10Period,
  productsQuadruplesTop10Period,
  productsSoldAmount,
  productsSoldAmountAllStoresPeriod,
  productsSoldAmountStorePeriod,
  productsTotalRevenuePeriod,
  productsTripletsTop10Period,
} from "./controllers";

const router = express.Router();

router.get("/productsSoldAmount", productsSoldAmount);
router.get("/priceSoldTotal", priceSoldTotal);
router.get("/priceSoldTotalPeriod", priceSoldTotalPeriod);
router.get("/productsSoldAmountStorePeriod", productsSoldAmountStorePeriod);
router.get(
  "/productsSoldAmountAllStoresPeriod",
  productsSoldAmountAllStoresPeriod
);
router.get("/productsTotalRevenuePeriod", productsTotalRevenuePeriod);
router.get("/productsPairsTop10Period", productsPairsTop10Period);
router.get("/productsTripletsTop10Period", productsTripletsTop10Period);
router.get("/productsQuadruplesTop10Period", productsQuadruplesTop10Period);

export default router;
