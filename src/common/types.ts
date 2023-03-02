export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Store {
  id: number;
  name: string;
}

export interface ProductsStore {
  id: number;
  productId: number;
  storeId: number;
}

export interface Bill {
  id: number;
  storeId: number;
  createdAt: Date;
}

export interface ProductsBill {
  id: number;
  productId: number;
  billId: number;
}
