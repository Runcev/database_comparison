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
  return `(${id}, ${storeId}, '${createdAt.toISOString().split("T")[0]}')`;
};

const productsBillToValues = (productsBill: ProductsBill) => {
  const { id, productId, billId } = productsBill;
  return `(${id}, ${productId}, ${billId})`;
};
