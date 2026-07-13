export const SHIPPING_FEE = 5.99;
export const TAX_RATE = 0.07;

export const calculateTax = (subtotal: number): number => subtotal * TAX_RATE;

export const calculateOrderTotal = (subtotal: number): number =>
  Number((subtotal + SHIPPING_FEE + calculateTax(subtotal)).toFixed(2));
