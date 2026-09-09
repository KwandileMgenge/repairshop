INSERT INTO customers (
  first_name, last_name, email, phone_number, address, address2, city, province, zip_code, is_active, created_at, updated_at
  ) VALUES 
  ('John', 'Doe', 'john.doe@example.com', '555-1234', '123 Main St', 'Apt 1', 'Anytown', 'Anystate', '12345', true, NOW(), NOW()),
  ('Jane', 'Smith', 'jane.smith@example.com', '555-5678', '456 Oak Ave', NULL, 'Somewhere', 'Somestate', '67890', true, NOW(), NOW()),
  ('Alice', 'Johnson', 'alice.johnson@example.com', '555-9012', '789 Pine Rd', NULL, 'Elsewhere', 'Elsestate', '09876', true, NOW(), NOW()),
  ('Bob', 'Brown', 'bob.brown@example.com', '555-3456', '101 Elm St', NULL, 'Nowhere', 'Nowherestate', '54321', true, NOW(), NOW()),
  ('Charlie', 'Davis', 'charlie.davis@example.com', '555-7890', '202 Maple Dr', 'Apt 5', 'Everywhere', 'Everystate', '11111', true, NOW(), NOW());