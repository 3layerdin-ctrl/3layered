-- Add coupon code and discount columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0;

-- Add index for faster coupon code lookups
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders (coupon_code)
WHERE
    coupon_code IS NOT NULL;