-- Roses & Clovers Properties Seed Data
-- Run this after 001_create_tables.sql for development/testing

-- Insert sample properties
INSERT INTO properties (name, address_line1, address_line2, city, state, zip, property_type, bedrooms, bathrooms, square_feet, monthly_rent, deposit_amount, available, available_date, description, amenities) VALUES
('Clover Heights Apartment', '123 Clover Lane', 'Unit 4A', 'Portland', 'OR', '97201', 'apartment', 2, 1.0, 850, 1450.00, 1450.00, TRUE, '2025-03-01', 'Charming 2-bedroom apartment in the heart of downtown. Features hardwood floors, updated kitchen, and in-unit laundry.', '["In-unit laundry", "Hardwood floors", "Central AC", "Dishwasher", "Pet friendly"]'),

('Rose Garden Cottage', '456 Rose Street', NULL, 'Portland', 'OR', '97202', 'house', 3, 2.0, 1400, 2200.00, 2200.00, TRUE, '2025-02-15', 'Beautiful single-family home with a private backyard garden. Updated throughout with modern amenities while maintaining classic charm.', '["Private yard", "Garage", "Central AC", "Washer/Dryer", "Fireplace"]'),

('Meadow View Studio', '789 Meadow Ave', 'Studio 2', 'Portland', 'OR', '97203', 'studio', 0, 1.0, 450, 950.00, 950.00, TRUE, NULL, 'Cozy studio apartment perfect for singles or couples. Great natural light and efficient layout.', '["Utilities included", "Street parking", "Laundry in building"]'),

('Shamrock Duplex - Upper', '321 Shamrock Drive', 'Unit B', 'Portland', 'OR', '97204', 'duplex', 2, 1.5, 1000, 1650.00, 1650.00, FALSE, NULL, 'Spacious upper-level duplex unit with private entrance. Recently renovated kitchen and bathroom.', '["Private entrance", "Covered parking", "Central heat", "Dishwasher"]'),

('Petal Place Townhouse', '555 Petal Court', NULL, 'Portland', 'OR', '97205', 'townhouse', 3, 2.5, 1800, 2800.00, 2800.00, TRUE, '2025-04-01', 'Modern townhouse with open floor plan, two-car garage, and rooftop deck. Walking distance to shops and restaurants.', '["2-car garage", "Rooftop deck", "Central AC", "In-unit laundry", "Smart home features"]'),

('Garden Gate Condo', '888 Garden Way', 'Unit 12', 'Portland', 'OR', '97206', 'condo', 1, 1.0, 700, 1250.00, 1250.00, TRUE, NULL, 'Well-maintained condo in quiet community. Features include pool access, gym, and covered parking.', '["Pool", "Gym", "Covered parking", "Gated community", "Storage unit"]'),

('Wildflower House', '999 Wildflower Lane', NULL, 'Lake Oswego', 'OR', '97034', 'house', 4, 3.0, 2400, 3500.00, 3500.00, FALSE, NULL, 'Spacious family home in excellent school district. Large backyard, updated kitchen, and home office space.', '["Large yard", "2-car garage", "Home office", "Central AC", "Sprinkler system"]'),

('Ivy Terrace Apartment', '222 Ivy Street', 'Apt 8', 'Beaverton', 'OR', '97005', 'apartment', 1, 1.0, 650, 1150.00, 1150.00, TRUE, '2025-02-01', 'Clean and bright 1-bedroom near public transit. Perfect for commuters.', '["Near transit", "Laundry in building", "Bike storage", "Package lockers"]');

-- Insert sample tenants
INSERT INTO tenants (first_name, last_name, email, phone, date_of_birth, emergency_contact_name, emergency_contact_phone, notes) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', '503-555-0101', '1990-05-15', 'Mike Johnson', '503-555-0102', 'Excellent tenant, always pays on time.'),

('Marcus', 'Chen', 'marcus.chen@email.com', '503-555-0201', '1985-11-22', 'Lin Chen', '503-555-0202', NULL),

('Emily', 'Rodriguez', 'emily.rodriguez@email.com', '503-555-0301', '1992-03-08', 'Carlos Rodriguez', '503-555-0302', 'Has one cat (approved).'),

('David', 'Kim', 'david.kim@email.com', '503-555-0401', '1988-07-30', 'Susan Kim', '503-555-0402', NULL),

('Jessica', 'Williams', 'jessica.williams@email.com', '503-555-0501', '1995-01-12', 'Robert Williams', '503-555-0502', 'Graduate student at PSU.');

-- Insert sample leases
-- Shamrock Duplex is occupied (property 4)
INSERT INTO leases (property_id, tenant_id, start_date, end_date, monthly_rent, deposit_amount, status, payment_due_day, notes) VALUES
(4, 1, '2024-06-01', '2025-05-31', 1650.00, 1650.00, 'active', 1, 'Annual lease, first renewal.'),

-- Wildflower House is occupied (property 7)
(7, 2, '2024-01-15', '2026-01-14', 3500.00, 3500.00, 'active', 15, 'Two-year lease. Tenant maintains yard.'),

-- Past lease for Rose Garden Cottage
(2, 3, '2023-03-01', '2024-02-28', 2100.00, 2100.00, 'ended', 1, 'Moved out in good standing.'),

-- Upcoming lease for Clover Heights
(1, 4, '2025-03-01', '2026-02-28', 1450.00, 1450.00, 'upcoming', 1, 'New tenant, moving from out of state.');

-- Add some audit log entries
INSERT INTO audit_log (action, entity_type, entity_id, details) VALUES
('create', 'property', 1, '{"name": "Clover Heights Apartment", "user": "admin"}'),
('create', 'property', 2, '{"name": "Rose Garden Cottage", "user": "admin"}'),
('create', 'tenant', 1, '{"name": "Sarah Johnson", "user": "admin"}'),
('create', 'lease', 1, '{"property": "Shamrock Duplex", "tenant": "Sarah Johnson", "user": "admin"}');
