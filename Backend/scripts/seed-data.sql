-- Insert sample sports
INSERT INTO sports (name, description) VALUES 
('Badminton', 'Indoor racquet sport played with shuttlecocks'),
('Tennis', 'Racquet sport played on a rectangular court'),
('Football', 'Team sport played with a spherical ball'),
('Basketball', 'Team sport played on a rectangular court with hoops'),
('Cricket', 'Bat-and-ball game played between two teams'),
('Table Tennis', 'Indoor sport played on a table with paddles'),
('Volleyball', 'Team sport played with a net'),
('Squash', 'Racquet sport played in a four-walled court')
ON CONFLICT (name) DO NOTHING;

-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role, is_verified) VALUES 
('admin@quickcourt.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample facility owner
INSERT INTO users (email, password_hash, full_name, role, phone_number, is_verified) VALUES 
('owner@quickcourt.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Facility Owner', 'facility_owner', '+1234567890', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample user
INSERT INTO users (email, password_hash, full_name, role, phone_number, is_verified) VALUES 
('user@quickcourt.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Test User', 'user', '+1234567891', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample facilities (assuming owner_id = 2 for facility owner)
INSERT INTO facilities (owner_id, name, description, address, latitude, longitude, approval_status) VALUES 
(2, 'Sports Complex Central', 'Modern sports facility with multiple courts and amenities', '123 Sports Avenue, Downtown', 40.7128, -74.0060, 'approved'),
(2, 'Elite Badminton Club', 'Premium badminton facility with professional courts', '456 Racquet Street, Midtown', 40.7589, -73.9851, 'approved'),
(2, 'Community Sports Center', 'Affordable sports facility for all ages', '789 Community Drive, Uptown', 40.7831, -73.9712, 'approved')
ON CONFLICT DO NOTHING;

-- Insert sample courts (assuming facility_ids 1, 2, 3 and sport_ids 1, 2, 3, 4)
INSERT INTO courts (facility_id, name, sport_id) VALUES 
(1, 'Court A1', 1), -- Badminton
(1, 'Court A2', 1), -- Badminton  
(1, 'Court B1', 2), -- Tennis
(1, 'Field C1', 3), -- Football
(2, 'Premium Court 1', 1), -- Badminton
(2, 'Premium Court 2', 1), -- Badminton
(3, 'Community Court 1', 1), -- Badminton
(3, 'Community Court 2', 4), -- Basketball
(3, 'Community Field', 3) -- Football
ON CONFLICT DO NOTHING;

-- Insert sample court pricing
INSERT INTO court_pricing (court_id, price_per_hour) VALUES 
(1, 25.00),
(2, 25.00),
(3, 40.00),
(4, 60.00),
(5, 50.00),
(6, 50.00),
(7, 20.00),
(8, 30.00),
(9, 45.00)
ON CONFLICT DO NOTHING;

-- Insert sample operating hours (Monday = 1, Sunday = 0)
INSERT INTO operating_hours (court_id, day_of_week, opening_time, closing_time) VALUES 
-- Court 1 - All days 6 AM to 11 PM
(1, 1, '06:00:00', '23:00:00'),
(1, 2, '06:00:00', '23:00:00'),
(1, 3, '06:00:00', '23:00:00'),
(1, 4, '06:00:00', '23:00:00'),
(1, 5, '06:00:00', '23:00:00'),
(1, 6, '07:00:00', '22:00:00'),
(1, 0, '07:00:00', '22:00:00'),
-- Court 2 - All days 6 AM to 11 PM
(2, 1, '06:00:00', '23:00:00'),
(2, 2, '06:00:00', '23:00:00'),
(2, 3, '06:00:00', '23:00:00'),
(2, 4, '06:00:00', '23:00:00'),
(2, 5, '06:00:00', '23:00:00'),
(2, 6, '07:00:00', '22:00:00'),
(2, 0, '07:00:00', '22:00:00')
ON CONFLICT DO NOTHING;

-- Insert sample facility sports relationships
INSERT INTO facility_sports (facility_id, sport_id) VALUES 
(1, 1), -- Sports Complex - Badminton
(1, 2), -- Sports Complex - Tennis
(1, 3), -- Sports Complex - Football
(1, 4), -- Sports Complex - Basketball
(2, 1), -- Elite Badminton - Badminton
(3, 1), -- Community Center - Badminton
(3, 3), -- Community Center - Football
(3, 4)  -- Community Center - Basketball
ON CONFLICT DO NOTHING;

-- Insert sample amenities
INSERT INTO facility_amenities (facility_id, amenity_name) VALUES 
(1, 'Parking'),
(1, 'Changing Rooms'),
(1, 'Cafeteria'),
(1, 'Equipment Rental'),
(1, 'Air Conditioning'),
(2, 'Parking'),
(2, 'Changing Rooms'),
(2, 'Professional Coaching'),
(2, 'Equipment Rental'),
(2, 'Air Conditioning'),
(3, 'Parking'),
(3, 'Changing Rooms'),
(3, 'Water Fountain')
ON CONFLICT DO NOTHING;
