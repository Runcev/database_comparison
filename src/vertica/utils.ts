import verticaClient from "./config";
import {Bill, Product, ProductsBill, ProductsStore, Store} from "../common/types";
import {generateBills, generateProductsBills, generateProductsStores, products, stores} from "../common/data";

verticaClient.connect();

export const clearVerticaDatabase = async () => {
    await verticaClient.query("DROP SCHEMA IF EXISTS \"shop\" CASCADE", async (err: any) => {
        if (err) {
            console.error(err);
        }
    })
}

export const initializeVerticaDatabase = async () => {
    await verticaClient.query("CREATE SCHEMA IF NOT EXISTS shop", async (err: any, res: { rows: any[] }) => {
        if (err) {
            console.error(err)
        }
        else {
             await verticaClient.query(createProductsTableQuery, async (err: { message: any; }) => {
                if(err) {
                    console.error(err)
                }
                else {
                    await verticaClient.query(getFillProductsQuery(products), async (err: any) => {
                        if(err) {
                            console.error(err)
                        }
                        else {
                            await verticaClient.query("COMMIT")
                        }
                    });
                }
             });

            await verticaClient.query(createStoresTableQuery, async (err: { message: any; }) => {
                if (err) {
                    console.error(err.message);
                } else {
                    await verticaClient.query(getFillStoresQuery(stores), async (err: any) => {
                        if(err) {
                            console.error(err)
                        }
                        else {
                            await verticaClient.query("COMMIT")
                        }
                    });
                }
            });

            await verticaClient.query(createProductsStoresTableQuery, async (err: { message: any; }) => {
                if (err) {
                    console.error(err.message);
                } else {
                    await verticaClient.query(getFillProductsStoresQuery(generateProductsStores()), async (err: any) => {
                        if(err) {
                            console.error(err)
                        }
                        else {
                            await verticaClient.query("COMMIT")
                        }
                    });
                }
            });

            await verticaClient.query(createBillsTableQuery, async (err: { message: any; }) => {
                if (err) {
                    console.error(err.message);
                } else {
                    await verticaClient.query(getFillBillsQuery(generateBills()), async (err: any) => {
                        if (err) {
                            console.error(err)
                        } else {
                            await verticaClient.query("COMMIT")
                        }
                    });
                }
            });

            await verticaClient.query(createProductsBillsTableQuery, async (err: { message: any; }) => {
                if (err) {
                    console.error(err.message);
                } else {
                    await verticaClient.query(getFillProductsBillsQuery(generateProductsBills(40, 40, 20)), async (err: any) => {
                        if(err) {
                            console.error(err)
                        }
                        else {
                            await verticaClient.query("COMMIT")
                        }
                    });
                }
            });
        }
    })
}

// export const verticaQueryExecution = async () => {
//     await verticaClient.query(firstQuery, async (err: { message: any; }, res: { rows: any[] }) => {
//         if (err) {
//             console.error(err.message);
//         } else {
//             console.log(res.rows)
//         }
//     });
// }

const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS shop.products (
        id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        PRIMARY KEY (id)
    );
`;

const createStoresTableQuery = `
    CREATE TABLE IF NOT EXISTS shop.stores (
        id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
`;

const createProductsStoresTableQuery = `
    CREATE TABLE IF NOT EXISTS shop.products_stores (
        id INT NOT NULL,
        product_id INT NOT NULL,
        store_id INT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES shop.products(id),
        CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES shop.stores(id)
    );
`;

const createBillsTableQuery = `
    CREATE TABLE IF NOT EXISTS shop.bills (
        id INT NOT NULL,
        store_id INT NOT NULL,
        created_at DATE NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_store_bills FOREIGN KEY (store_id) REFERENCES shop.stores(id)
    );
`;

const createProductsBillsTableQuery = `
    CREATE TABLE IF NOT EXISTS shop.products_bills (
        id INT NOT NULL,
        product_id INT NOT NULL,
        bill_id INT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_product_bills FOREIGN KEY (product_id) REFERENCES shop.products(id),
        CONSTRAINT fk_bill_products FOREIGN KEY (bill_id) REFERENCES shop.bills(id)
    );
`;

export const getVerticaFirstQuery = () => `
    SELECT COUNT(shop.products_bills.id) AS sold_quantity
    FROM shop.products_bills
`;

export const getVerticaSecondQuery = () => `
    SELECT SUM(shop.products.price) AS total_price
        FROM shop.products
        JOIN shop.products_bills AS pb ON products.id = pb.product_id 
`
export const getVerticaThirdQuery = (periodStart: string, periodEnd: string) => `
    SELECT SUM(shop.products.price) as total_price_by_date_range
        FROM shop.products
        JOIN shop.products_bills AS pb ON products.id = pb.product_id
        JOIN shop.bills ON bills.id = pb.bill_id
        WHERE shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}';
`
export const getVerticaFourthQuery = (periodStart: string, periodEnd: string) => `
     SELECT shop.stores.name, shop.products.name, COUNT(shop.products.name) AS sold_amount
        FROM shop.products 
        JOIN shop.products_bills AS pb ON products.id = pb.product_id 
        JOIN shop.bills ON bills.id = pb.bill_id 
        JOIN shop.stores ON shop.bills.store_id = shop.stores.id 
        WHERE shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY shop.stores.name, shop.products.name
        ORDER BY shop.stores.name ASC
`

export const getVerticaFifthQuery = (product: string, periodStart: string, periodEnd: string) => `
    SELECT shop.products.name, COUNT(*) AS total_amount_by_period
        FROM shop.products
        JOIN shop.products_bills AS pb ON shop.products.id = pb.product_id 
        JOIN shop.bills ON shop.bills.id = pb.bill_id 
        WHERE shop.products.name = '${product}' AND shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY shop.products.name
`

export const getVerticaSixthQuery = (periodStart: string, periodEnd: string) => `
    SELECT SUM(shop.products.price) as total_revenue_by_period
        FROM shop.products 
        JOIN shop.products_bills AS pb ON shop.products.id = pb.product_id
        JOIN shop.bills ON shop.bills.id = pb.bill_id
        WHERE shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}';
`

export const getVerticaSeventhQuery = (periodStart: string, periodEnd: string) => `        
    SELECT p1.name, p2.name, COUNT(*) AS pair_count
        FROM shop.products_bills pb1
        JOIN shop.products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN shop.products p1 ON p1.id = pb1.product_id
        JOIN shop.products p2 ON p2.id = pb2.product_id
        JOIN shop.bills ON pb1.bill_id = shop.bills.id
        WHERE pb1.product_id < pb2.product_id AND shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p1.name, p2.name
        ORDER BY pair_count DESC
        LIMIT 10;
`

export const getVerticaEighthQuery = (periodStart: string, periodEnd: string) => `
    SELECT p1.name, p2.name, p3.name, COUNT(*) AS triplet_count
        FROM shop.products_bills pb1
        JOIN shop.products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN shop.products_bills pb3 ON pb2.bill_id = pb3.bill_id AND pb2.product_id < pb3.product_id
        JOIN shop.products p1 ON p1.id = pb1.product_id
        JOIN shop.products p2 ON p2.id = pb2.product_id
        JOIN shop.products p3 ON p3.id = pb3.product_id
        JOIN shop.bills ON pb1.bill_id = shop.bills.id
        WHERE pb1.product_id < pb2.product_id AND pb2.product_id < pb3.product_id AND shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p3.id, p1.name, p2.name, p3.name
        ORDER BY triplet_count DESC
        LIMIT 10;
`

export const getVerticaNinthQuery = (periodStart: string, periodEnd: string) => `
    SELECT p1.name, p2.name, p3.name, p4.name, COUNT(*) AS quadruple_count
        FROM shop.products_bills pb1
        JOIN shop.products_bills pb2 ON pb1.bill_id = pb2.bill_id AND pb1.product_id < pb2.product_id
        JOIN shop.products_bills pb3 ON pb2.bill_id = pb3.bill_id AND pb2.product_id < pb3.product_id
        JOIN shop.products_bills pb4 ON pb3.bill_id = pb4.bill_id AND pb3.product_id < pb4.product_id
        JOIN shop.products p1 ON p1.id = pb1.product_id
        JOIN shop.products p2 ON p2.id = pb2.product_id
        JOIN shop.products p3 ON p3.id = pb3.product_id
        JOIN shop.products p4 ON p4.id = pb4.product_id
        JOIN shop.bills ON pb1.bill_id = shop.bills.id
        WHERE pb1.product_id < pb2.product_id AND pb2.product_id < pb3.product_id AND pb3.product_id < pb4.product_id AND shop.bills.created_at BETWEEN '${periodStart}' AND '${periodEnd}'
        GROUP BY p1.id, p2.id, p3.id, p4.id, p1.name, p2.name, p3.name, p4.name
        ORDER BY quadruple_count DESC
        LIMIT 10;
`

const getFillProductsQuery = (products: Product[]) => `
  INSERT INTO shop.products
  VALUES ${products.map(productToValues).join(",")}
`;

const getFillStoresQuery = (stores: Store[]) => `
  INSERT INTO shop.stores(id, name)
  VALUES ${stores.map(storeToValues).join(",")}
`;

const getFillProductsStoresQuery = (productsStore: ProductsStore[]) => `
  INSERT INTO shop.products_stores(id, product_id, store_id)
  VALUES ${productsStore.map(productsStoreToValues).join(",")}
`;

const getFillBillsQuery = (bills: Bill[]) => `
  INSERT INTO shop.bills(id, store_id, created_at)
  VALUES ${bills.map(billsToValues).join(",")}
`;

const getFillProductsBillsQuery = (productsBill: ProductsBill[]) => `
  INSERT INTO shop.products_bills(id, product_id, bill_id)
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
