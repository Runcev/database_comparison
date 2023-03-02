import { Bill, Product, ProductsBill, ProductsStore, Store } from "./types";

export const products: Product[] = [
  { id: 1, name: "Bananas", price: 25 },
  { id: 2, name: "Apples", price: 29 },
  { id: 3, name: "Oranges", price: 24 },
  { id: 4, name: "Carrots", price: 14 },
  { id: 5, name: "Tomatoes", price: 39 },
  { id: 6, name: "Potatoes", price: 19 },
  { id: 7, name: "Onions", price: 12 },
  { id: 8, name: "Cucumbers", price: 29 },
  { id: 9, name: "Eggs", price: 22 },
  { id: 10, name: "Milk", price: 34 },
  { id: 11, name: "Cheese", price: 69 },
  { id: 12, name: "Butter", price: 44 },
  { id: 13, name: "Chicken", price: 89 },
  { id: 14, name: "Beef", price: 129 },
  { id: 15, name: "Pork", price: 99 },
  { id: 16, name: "Fish", price: 79 },
  { id: 17, name: "Bread", price: 19 },
  { id: 18, name: "Rice", price: 29 },
  { id: 19, name: "Pasta", price: 24 },
  { id: 20, name: "Flour", price: 9 },
  { id: 21, name: "Sugar", price: 14 },
  { id: 22, name: "Salt", price: 7 },
  { id: 23, name: "Pepper", price: 12 },
  { id: 24, name: "Coffee", price: 69 },
  { id: 25, name: "Tea", price: 24 },
  { id: 26, name: "Water", price: 9 },
  { id: 27, name: "Juice", price: 39 },
  { id: 28, name: "Soda", price: 14 },
  { id: 29, name: "Beer", price: 29 },
  { id: 30, name: "Wine", price: 89 },
  { id: 31, name: "Chocolate", price: 24 },
  { id: 32, name: "Candy", price: 12 },
  { id: 33, name: "Cookies", price: 19 },
  { id: 34, name: "Chips", price: 14 },
  { id: 35, name: "Nuts", price: 39 },
];

export const stores: Store[] = [
  { id: 1, name: "ATB Market" },
  { id: 2, name: "Silpo" },
  { id: 3, name: "Fozzy" },
  { id: 4, name: "Metro Cash & Carry" },
  { id: 5, name: "Billa" },
  { id: 6, name: "Auchan" },
  { id: 7, name: "Epicenter" },
  { id: 8, name: "Nova Linia" },
  { id: 9, name: "Varus" },
  { id: 10, name: "Fora" },
];

export const generateProductsStores = (): ProductsStore[] => {
  const productsShops: ProductsStore[] = [];

  let productsShopsCount = 1;
  stores.forEach(({ id: storeId }) => {
    // Products from 25 to 35 to be added to shop
    const productsAmount = Math.floor(Math.random() * 11) + 25;
    const productsToRemoveNumber =
      Math.floor(Math.random() * (products.length - productsAmount)) + 1;
    const offset =
      Math.floor(Math.random() * (products.length - productsToRemoveNumber)) +
      1;

    const storeProducts = [...products];
    storeProducts.splice(offset, offset + productsToRemoveNumber);
    const productsShopsArray: ProductsStore[] = storeProducts.map(
      ({ id: productId }) => ({
        id: productsShopsCount++,
        productId,
        storeId,
      })
    );
    productsShops.push(...productsShopsArray);
  });

  return productsShops;
};

const BILLS_AMOUNT = 100;

export const generateBills = (): Bill[] => {
  const bills: Bill[] = [];

  for (let i = 0; i < BILLS_AMOUNT; i++) {
    const storeId = Math.floor(Math.random() * 10) + 1;
    const bill: Bill = {
      id: i + 1,
      storeId,
      createdAt: getRandomDate(),
    };
    bills.push(bill);
  }

  return bills;
};

const PRODUCTS_RANDOM_LIMIT = 10;

export const generateProductsBills = (
  twoAmount: number,
  threeAmount: number,
  fourAmount: number
): ProductsBill[] => {
  if (twoAmount + threeAmount + fourAmount > BILLS_AMOUNT)
    throw new Error("ProductsChecks amount is greater than Bills amount");

  const productsChecks: ProductsBill[] = [];

  const offsetRandom =
    Math.floor(Math.random() * (products.length - PRODUCTS_RANDOM_LIMIT)) + 1;

  const productsEvaluated = [...products].splice(
    offsetRandom,
    PRODUCTS_RANDOM_LIMIT
  );

  const minIdLimit = productsEvaluated[0].id;

  let productsCheckIdCount = 1;
  let billIdCount = 1;

  [twoAmount, threeAmount, fourAmount].forEach((amount, index) => {
    for (let i = 0; i < amount; i++) {
      const productIds: number[] = [];
      while (productIds.length < index + 2) {
        const productId = Math.floor(Math.random() * 10) + minIdLimit;
        if (!productIds.includes(productId)) {
          productIds.push(productId);
        }
      }

      const productsChecksCreated = productIds.map((productId) => ({
        id: productsCheckIdCount++,
        productId,
        billId: billIdCount,
      }));
      billIdCount++;

      productsChecks.push(...productsChecksCreated);
    }
  });

  return productsChecks;
};

const getRandomDate = () => {
  const startDate = new Date("2023-02-01");
  const endDate = new Date("2023-03-01");
  const startMillis = startDate.getTime();
  const endMillis = endDate.getTime();
  const randomMillis =
    startMillis + Math.floor(Math.random() * (endMillis - startMillis));
  return new Date(randomMillis);
};
