import { Connection } from "mysql2";
import mySqlConnection from "./config";
import {
  Bill,
  Product,
  ProductsBill,
  ProductsStore,
  Store,
} from "../common/types";
import {
  generateBills,
  generateProductsBills,
  generateProductsStores,
  products,
  stores,
} from "../common/data";

export const clearSqlDatabase = async (
  connection: Connection = mySqlConnection
) => {
  await connection.execute(
    `DROP TABLE products, stores, bills, products_stores, products_bills`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
};

export const initializeSqlDatabase = async (
  connection: Connection = mySqlConnection
) => {
  await connection.execute(createProductsTableQuery, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      await connection.execute(getFillProductsQuery(products));
    }
  });

  await connection.execute(createStoresTableQuery, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      await connection.execute(getFillStoresQuery(stores));
    }
  });

  await connection.execute(createProductsStoresTableQuery, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      await connection.execute(
        getFillProductsStoresQuery(generateProductsStores())
      );
    }
  });

  await connection.execute(createBillsTableQuery, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      await connection.execute(getFillBillsQuery(generateBills()));
    }
  });

  await connection.execute(createProductsBillsTableQuery, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      await connection.execute(
        getFillProductsBillsQuery(generateProductsBills(40, 40, 20))
      );
    }
  });
};

const createProductsTableQuery = `
    CREATE TABLE products (
        id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        PRIMARY KEY (id)
    );
`;

const createStoresTableQuery = `
    CREATE TABLE stores (
        id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
`;

const createProductsStoresTableQuery = `
    CREATE TABLE products_stores (
        id INT NOT NULL,
        product_id INT NOT NULL,
        store_id INT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
        CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES stores(id)
    );
`;

const createBillsTableQuery = `
    CREATE TABLE bills (
        id INT NOT NULL,
        store_id INT NOT NULL,
        created_at DATE NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_store_bills FOREIGN KEY (store_id) REFERENCES stores(id)
    );
`;

const createProductsBillsTableQuery = `
    CREATE TABLE products_bills (
        id INT NOT NULL,
        product_id INT NOT NULL,
        bill_id INT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_product_bills FOREIGN KEY (product_id) REFERENCES products(id),
        CONSTRAINT fk_bill_products FOREIGN KEY (bill_id) REFERENCES bills(id)
    );
`;

const getFillProductsQuery = (products: Product[]) => `
  INSERT INTO products(id, name, price)
  VALUES ${products.map(productToValues).join(",")}
`;

const getFillStoresQuery = (stores: Store[]) => `
  INSERT INTO stores(id, name)
  VALUES ${stores.map(storeToValues).join(",")}
`;

const getFillProductsStoresQuery = (productsStore: ProductsStore[]) => `
  INSERT INTO products_stores(id, product_id, store_id)
  VALUES ${productsStore.map(productsStoreToValues).join(",")}
`;

const getFillBillsQuery = (bills: Bill[]) => `
  INSERT INTO bills(id, store_id, created_at)
  VALUES ${bills.map(billsToValues).join(",")}
`;

const getFillProductsBillsQuery = (productsBill: ProductsBill[]) => `
  INSERT INTO products_bills(id, product_id, bill_id)
  VALUES ${productsBill.map(productsBillToValues).join(",")}
`;

const productToValues = (product: Product) => {
  const { id, name, price } = product;
  return `(${id}, '${name}', ${price})`;
};

const storeToValues = (store: Store) => {
  const { id, name } = store;
  return `(${id}, '${name}')`;
};

const productsStoreToValues = (productsStore: ProductsStore) => {
  const { id, productId, storeId } = productsStore;
  return `(${id}, ${productId}, ${storeId})`;
};

const billsToValues = (bill: Bill) => {
  const { id, storeId, createdAt } = bill;
  return `(${id}, ${storeId}, '${getQueryDate(createdAt)}')`;
};

const productsBillToValues = (productsBill: ProductsBill) => {
  const { id, productId, billId } = productsBill;
  return `(${id}, ${productId}, ${billId})`;
};

const getQueryDate = (date: Date) => date.toISOString().split("T")[0];

export const getSqlFirstQuery = () => `
    SELECT COUNT(products_bills.id) AS sold_quantity
    FROM products_bills
`;

export const getSqlSecondQuery = () => `
    SELECT SUM(products.price) AS total_price
        FROM products
        JOIN products_bills AS pb ON products.id = pb.product_id 
`
export const getSqlThirdQuery = (periodStart: string, periodEnd: string) => `
    SELECT SUM(products.price) as total_price_by_date_range
        FROM products
        JOIN products_bills AS pb ON products.id = pb.product_id
        JOIN bills ON bills.id = pb.bill_id
        WHERE bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}';
`
export const getSqlFourthQuery = (periodStart: string, periodEnd: string) => `
     SELECT stores.name, products.name, COUNT(products.name) AS sold_amount
        FROM products 
        JOIN products_bills AS pb ON products.id = pb.product_id 
        JOIN bills ON bills.id = pb.bill_id 
        JOIN stores ON bills.store_id = stores.id 
        WHERE bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY stores.name, products.name
        ORDER BY stores.name ASC
`

export const getSqlFifthQuery = (product: string, periodStart: string, periodEnd: string) => `
    SELECT products.name, COUNT(*) AS total_amount_by_period
        FROM products
        JOIN products_bills AS pb ON products.id = pb.product_id 
        JOIN bills ON bills.id = pb.bill_id 
        WHERE products.name = '${product}' AND bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY products.name
`

export const getSqlSixthQuery = (periodStart: string, periodEnd: string) => `
    SELECT SUM(products.price) as total_revenue_by_period
        FROM products 
        JOIN products_bills AS pb ON products.id = pb.product_id
        JOIN bills ON bills.id = pb.bill_id
        WHERE bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}';
`

export const getSqlSeventhQuery = (periodStart: string, periodEnd: string) => `        
    SELECT p1.name, p2.name, COUNT(*) AS pair_count
        FROM products_bills pb1
        JOIN products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN products p1 ON p1.id = pb1.product_id
        JOIN products p2 ON p2.id = pb2.product_id
        JOIN bills ON pb1.bill_id = bills.id
        WHERE pb1.product_id < pb2.product_id AND bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p1.name, p2.name
        ORDER BY pair_count DESC
        LIMIT 10;
`

export const getSqlEighthQuery = (periodStart: string, periodEnd: string) => `
    SELECT p1.name, p2.name, p3.name, COUNT(*) AS triplet_count
        FROM products_bills pb1
        JOIN products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN products_bills pb3 ON pb2.bill_id = pb3.bill_id AND pb2.product_id < pb3.product_id
        JOIN products p1 ON p1.id = pb1.product_id
        JOIN products p2 ON p2.id = pb2.product_id
        JOIN products p3 ON p3.id = pb3.product_id
        JOIN bills ON pb1.bill_id = bills.id
        WHERE pb1.product_id < pb2.product_id AND pb2.product_id < pb3.product_id AND bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p3.id, p1.name, p2.name, p3.name
        ORDER BY triplet_count DESC
        LIMIT 10;
`

export const getSqlNinthQuery = (periodStart: string, periodEnd: string) => `
    SELECT p1.name, p2.name, p3.name, p4.name, COUNT(*) AS quadruple_count
        FROM products_bills pb1
        JOIN products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN products_bills pb3 ON pb2.bill_id = pb3.bill_id AND pb2.product_id < pb3.product_id
        JOIN products_bills pb4 ON pb3.bill_id = pb4.bill_id AND pb3.product_id < pb4.product_id
        JOIN products p1 ON p1.id = pb1.product_id
        JOIN products p2 ON p2.id = pb2.product_id
        JOIN products p3 ON p3.id = pb3.product_id
        JOIN products p4 ON p4.id = pb4.product_id
        JOIN bills ON pb1.bill_id = bills.id
        WHERE pb1.product_id < pb2.product_id AND pb2.product_id < pb3.product_id AND pb3.product_id < pb4.product_id AND bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p3.id, p4.id, p1.name, p2.name, p3.name, p4.name
        ORDER BY quadruple_count DESC
        LIMIT 10;
`
