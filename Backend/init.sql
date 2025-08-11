-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS admin_actions CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS blocked_slots CASCADE;
DROP TABLE IF EXISTS operating_hours CASCADE;
DROP TABLE IF EXISTS court_pricing CASCADE;
DROP TABLE IF EXISTS courts CASCADE;
DROP TABLE IF EXISTS facility_photos CASCADE;
DROP TABLE IF EXISTS facility_amenities CASCADE;
DROP TABLE IF EXISTS facility_sports CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'facility_owner', 'admin')),
    phone_number VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(6),
    otp_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Stores all user accounts including regular users, facility owners, and admins';
COMMENT ON COLUMN users.role IS 'Defines user role: user, facility_owner, or admin';

-- 2. sports table
CREATE TABLE sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sports IS 'Master list of all sports supported by the platform';

-- 3. facilities table
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE facilities IS 'Sports facilities/venues that can be booked';
COMMENT ON COLUMN facilities.approval_status IS 'Tracks admin approval status for new facilities';

-- 4. facility_sports junction table
CREATE TABLE facility_sports (
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (facility_id, sport_id)
);

COMMENT ON TABLE facility_sports IS 'Many-to-many relationship between facilities and sports they offer';

-- 5. facility_amenities table
CREATE TABLE facility_amenities (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255)
);

COMMENT ON TABLE facility_amenities IS 'Amenities available at each facility';

-- 6. facility_photos table
CREATE TABLE facility_photos (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE facility_photos IS 'Photos of facilities for gallery display';

-- 7. courts table
CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    sport_id INTEGER REFERENCES sports(id) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price_per_hour DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE courts IS 'Individual courts/fields within a facility that can be booked';

-- 8. court_pricing table
CREATE TABLE court_pricing (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    is_peak_hour BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (court_id, day_of_week, start_time, end_time)
);

COMMENT ON TABLE court_pricing IS 'Dynamic pricing rules for courts based on day/time';

-- 9. operating_hours table
CREATE TABLE operating_hours (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    opens_at TIME NOT NULL,
    closes_at TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    UNIQUE (court_id, day_of_week)
);

COMMENT ON TABLE operating_hours IS 'Regular operating hours for each court by day of week';

-- 10. blocked_slots table
CREATE TABLE blocked_slots (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    reason VARCHAR(100) NOT NULL, -- 'maintenance', 'private_event', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    CHECK (end_datetime > start_datetime)
);

COMMENT ON TABLE blocked_slots IS 'Time slots when a court is unavailable for booking';

-- 11. bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    court_id INTEGER REFERENCES courts(id) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    cancellation_reason TEXT,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

COMMENT ON TABLE bookings IS 'Court booking records';
COMMENT ON COLUMN bookings.status IS 'Current status of the booking';
COMMENT ON COLUMN bookings.payment_status IS 'Payment processing status';

-- 12. reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    facility_id INTEGER REFERENCES facilities(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id, user_id)
);

COMMENT ON TABLE reviews IS 'User reviews and ratings for facilities';

-- 13. notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(50) NOT NULL, -- 'booking_confirmation', 'reminder', etc.
    related_entity_type VARCHAR(50), -- 'booking', 'facility', etc.
    related_entity_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'System notifications for users';

-- 14. favorites table
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, facility_id)
);

COMMENT ON TABLE favorites IS 'User favorite facilities for quick access';

-- 15. admin_actions table
CREATE TABLE admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'facility_approval', 'user_ban', etc.
    target_id INTEGER NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'user', 'facility', etc.
    details TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE admin_actions IS 'Audit log of administrative actions';

-- Create indexes for performance
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_court ON bookings(court_id);
CREATE INDEX idx_bookings_dates ON bookings(start_time, end_time);
CREATE INDEX idx_courts_facility ON courts(facility_id);
CREATE INDEX idx_facilities_owner ON facilities(owner_id);
CREATE INDEX idx_facilities_location ON facilities(latitude, longitude);
CREATE INDEX idx_facilities_status ON facilities(approval_status);
CREATE INDEX idx_reviews_facility ON reviews(facility_id);

-- Create a function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_facilities_timestamp
BEFORE UPDATE ON facilities
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_courts_timestamp
BEFORE UPDATE ON courts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

INSERT INTO users (email, password_hash, full_name, avatar_url, role, phone_number, is_verified, created_at, updated_at)
VALUES ('john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq6PH.6MN/odYV7J6v5dWLj7JQJDO', 'John Doe', 'https://randomuser.me/api/portraits/men/1.jpg', 'user', '+14155551111', TRUE, '2024-02-01 14:00:00', '2024-02-01 14:00:00'),
    ('jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq6PH.6MN/odYV7J6v5dWLj7JQJDO', 'Jane Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'user', '+14155552222', TRUE, '2024-02-02 15:30:00', '2024-02-02 15:30:00'),
    ('mike.johnson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq6PH.6MN/odYV7J6v5dWLj7JQJDO', 'Mike Johnson', 'https://randomuser.me/api/portraits/men/3.jpg', 'user', '+14155553333', TRUE, '2024-02-03 16:45:00', '2024-02-03 16:45:00')
