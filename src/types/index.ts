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

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutReceipt {
  orderId: string;
  total: number;
  completedAt: string;
}

export interface CheckoutItem {
  price: string;
  quantity: number;
}
