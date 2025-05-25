export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutItem {
  price: string;
  quantity: number;
}