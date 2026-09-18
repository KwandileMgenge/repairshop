INSERT INTO customers (
  full_name, email, phone_number, address, address2, city, province, zip_code, is_active, created_at, updated_at
  ) VALUES 
  ('John Doe', 'john.doe@example.com', '0735551234', '123 Main St', 'Apt 1', 'Anytown', 'Anystate', '1234', true, NOW(), NOW()),
  ('Jane Smith', 'jane.smith@example.com', '0735555678', '456 Oak Ave', NULL, 'Somewhere', 'Somestate', '6789', true, NOW(), NOW()),
  ('Alice Johnson', 'alice.johnson@example.com', '0735559012', '789 Pine Rd', NULL, 'Elsewhere', 'Elsestate', '09876', true, NOW(), NOW()),
  ('Bob Brown', 'bob.brown@example.com', '0735553456', '101 Elm St', NULL, 'Nowhere', 'Nowherestate', '5432', true, NOW(), NOW()),
  ('Charlie Davis', 'charlie.davis@example.com', '0735557890', '202 Maple Dr', 'Apt 5', 'Everywhere', 'Everystate', '1111', true, NOW(), NOW());