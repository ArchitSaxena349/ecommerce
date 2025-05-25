/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `price` (numeric, not null)
      - `image` (text, not null)
      - `category` (text, not null)
      - `featured` (boolean, default false)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated and anonymous users to read products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Sample product data
INSERT INTO products (name, description, price, image, category, featured)
VALUES
  ('Premium Wireless Headphones', 'Experience crystal-clear sound with our premium wireless headphones. Features noise cancellation and 20-hour battery life.', 149.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1600', 'electronics', true),
  ('Slim Fit Denim Jacket', 'Classic denim jacket with a modern slim fit. Perfect for layering in any season.', 79.99, 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1600', 'clothing', true),
  ('Smart Home Speaker', 'Voice-controlled smart speaker with premium sound quality and smart home integration.', 129.99, 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1600', 'electronics', false),
  ('Minimalist Watch', 'Elegant minimalist watch with a leather strap. Water-resistant and perfect for any occasion.', 89.99, 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600', 'accessories', true),
  ('Ceramic Coffee Mug Set', 'Set of 4 handcrafted ceramic coffee mugs. Microwave and dishwasher safe.', 34.99, 'https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1600', 'home', false),
  ('Fitness Tracker', 'Track your steps, heart rate, and sleep with this waterproof fitness tracker.', 59.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1600', 'electronics', false),
  ('Leather Wallet', 'Genuine leather wallet with RFID protection. Multiple card slots and a coin pocket.', 45.99, 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1600', 'accessories', false),
  ('Scented Candle Set', 'Set of 3 premium scented candles. Long-lasting and made with natural soy wax.', 29.99, 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=1600', 'home', true),
  ('Wireless Earbuds', 'True wireless earbuds with touch controls and a charging case. 15-hour total battery life.', 89.99, 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1600', 'electronics', false),
  ('Cotton T-Shirt', 'Soft, breathable cotton t-shirt. Available in multiple colors.', 24.99, 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1600', 'clothing', false),
  ('Stainless Steel Water Bottle', 'Double-walled insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.', 19.99, 'https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=1600', 'home', false),
  ('Bluetooth Speaker', 'Portable Bluetooth speaker with 360° sound and 10-hour battery life. Waterproof and dustproof.', 69.99, 'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=1600', 'electronics', false);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for reading products (both authenticated and anonymous users)
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO PUBLIC
  USING (true);