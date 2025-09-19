-- This script sets up the 'products' table for the inventory management system.
-- It's designed to be compatible with PostgreSQL.

-- Drop the table if it already exists to start fresh.
DROP TABLE IF EXISTS products;

-- Create the 'products' table.
CREATE TABLE products (
    -- Unique identifier for each product, automatically generated.
    id SERIAL PRIMARY KEY,

    -- Name of the product (e.g., "Laptop", "Mouse"). Cannot be empty.
    name VARCHAR(255) NOT NULL,

    -- A brief description of the product.
    description TEXT,

    -- The quantity of the product in stock. Defaults to 0 and cannot be negative.
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),

    -- The price of a single unit of the product. Defaults to 0.00 and cannot be negative.
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),

    -- Timestamp for when the product record was created. Defaults to the current time.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- You can optionally insert some sample data to get started.
INSERT INTO products (name, description, quantity, price) VALUES
('Laptop Pro', '15-inch high-performance laptop', 50, 1200.50),
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 250, 25.00),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 120, 75.99),
('4K Monitor', '27-inch 4K UHD monitor', 80, 350.00);
