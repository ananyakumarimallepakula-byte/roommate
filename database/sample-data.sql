-- ========================================================
-- ROOMMATE Platform - Sample / Seed Data
-- ========================================================

-- Insert Amenities
INSERT INTO amenities (id, name, icon_name) VALUES
(1, 'High-Speed WiFi', 'wifi'),
(2, 'Air Conditioner (AC)', 'wind'),
(3, 'Geyser / Hot Water', 'droplet'),
(4, '24x7 Power Backup', 'zap'),
(5, 'RO Drinking Water', 'cup'),
(6, 'Washing Machine', 'disc'),
(7, 'Attached Bathroom', 'check-circle'),
(8, 'CCTV & Security', 'shield'),
(9, 'Refrigerator', 'box'),
(10, 'Meal Service / Mess', 'coffee'),
(11, 'Private Balcony', 'sun'),
(12, 'Elevator / Lift', 'arrow-up')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Default Users (Password for all: Password@123)
-- BCrypt: $2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, avatar_url) VALUES
(1, 'admin@roommate.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'System Administrator', '+919876543210', 'ADMIN', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'),
(2, 'rajesh.verma@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Rajesh Verma', '+919876543211', 'OWNER', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop'),
(3, 'sunita.sharma@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Sunita Sharma', '+919876543212', 'OWNER', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop'),
(4, 'aarav.patel@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Aarav Patel', '+919876543221', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop'),
(5, 'rohit.sharma@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Rohit Sharma', '+919876543222', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&fit=crop'),
(6, 'priya.singh@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Priya Singh', '+919876543223', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop'),
(7, 'ananya.sen@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Ananya Sen', '+919876543224', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop'),
(8, 'vikram.mehta@example.com', '$2a$10$wT0lU8754b5N0CqW200GSe28vW4g4tD72061oA4cM6o3O7j3YQj1m', 'Vikram Mehta', '+919876543225', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&fit=crop')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Owner Profiles
INSERT INTO owner_profiles (user_id, company_name, address, is_verified) VALUES
(2, 'Skyline Urban Living', 'Plot 44, Sector 15, Hauz Khas, New Delhi', true),
(3, 'Sunshine Student Homes', 'B-12, GTB Nagar, North Campus, New Delhi', true)
ON DUPLICATE KEY UPDATE company_name=company_name;

-- Insert Student Profiles
INSERT INTO student_profiles (user_id, age, gender, college, course, study_year, bio, is_completed) VALUES
(4, 21, 'MALE', 'IIT Delhi', 'B.Tech Computer Science', '3rd Year', 'Passionate developer and robotics enthusiast. Love quiet study hours, coding marathons, and fitness.', true),
(5, 21, 'MALE', 'DTU Delhi', 'B.Tech Mechanical Engineering', '3rd Year', 'Tech geek, gamer, and football fan. Looking for a neat and easy-going roommate near South Delhi.', true),
(6, 20, 'FEMALE', 'Delhi University - Miranda House', 'B.A. Economics (Hons)', '2nd Year', 'Loves literature, early morning yoga, and healthy cooking. Very mindful of cleanliness and personal space.', true),
(7, 20, 'FEMALE', 'Delhi University - SRCC', 'B.Com (Hons)', '2nd Year', 'Economics buff and painter. Early sleeper, respectful of study hours, looking for a warm roommate.', true),
(8, 22, 'MALE', 'NSUT Delhi', 'B.Tech Information Technology', '4th Year', 'Music producer and competitive programmer. Enjoys deep conversations and good music.', true)
ON DUPLICATE KEY UPDATE college=college;

-- Insert Roommate Preferences
INSERT INTO roommate_preferences (user_id, preferred_city, preferred_locality, min_budget, max_budget, room_type, target_move_in_date, sleep_schedule, study_habit, cleanliness_level, smoking_preference, pet_preference, food_preference, interests) VALUES
(4, 'New Delhi', 'Hauz Khas', 10000.00, 16000.00, 'PRIVATE', '2026-11-01', 'NIGHT_OWL', 'SILENT_STUDY', 'VERY_CLEAN', 'NON_SMOKER', 'PET_FRIENDLY', 'VEGETARIAN', 'Coding,Gaming,Gym,Music'),
(5, 'New Delhi', 'Hauz Khas', 9500.00, 15500.00, 'PRIVATE', '2026-11-01', 'NIGHT_OWL', 'SILENT_STUDY', 'VERY_CLEAN', 'NON_SMOKER', 'PET_FRIENDLY', 'VEGETARIAN', 'Coding,Gaming,Football,Gym'),
(6, 'New Delhi', 'North Campus', 7000.00, 12000.00, 'SHARED', '2026-11-15', 'EARLY_BIRD', 'SILENT_STUDY', 'VERY_CLEAN', 'NON_SMOKER', 'NO_PETS', 'VEGETARIAN', 'Reading,Yoga,Art,Cooking'),
(7, 'New Delhi', 'North Campus', 7500.00, 13000.00, 'SHARED', '2026-11-10', 'EARLY_BIRD', 'SILENT_STUDY', 'VERY_CLEAN', 'NON_SMOKER', 'NO_PETS', 'ANY', 'Reading,Painting,Music,Cooking'),
(8, 'New Delhi', 'Dwarka', 8000.00, 14000.00, 'PRIVATE', '2026-12-01', 'FLEXIBLE', 'MUSIC', 'MODERATE', 'NON_SMOKER', 'NO_PREFERENCE', 'ANY', 'Music,Coding,Travel')
ON DUPLICATE KEY UPDATE preferred_city=preferred_city;

-- Insert Accommodations
INSERT INTO accommodations (id, owner_id, title, description, city, locality, address, rent, security_deposit, room_type, furnishing_status, gender_preference, available_from, availability_status, moderation_status, house_rules) VALUES
(1, 2, 'Luxury Studio Room near Hauz Khas Metro', 'Spacious, well-ventilated studio apartment equipped with air conditioning, premium wooden bed, study desk, ergonomic chair, and attached bath. Perfect for college students and working scholars.', 'New Delhi', 'Hauz Khas', 'A-32, Kaushalya Park, Hauz Khas, New Delhi', 13500.00, 27000.00, 'PRIVATE', 'FULLY_FURNISHED', 'ANY', '2026-11-01', 'AVAILABLE', 'APPROVED', 'No loud music after 11 PM. Keep common areas clean. Guests allowed with prior notice.'),
(2, 2, 'Premium 2BHK Shared Flat with Balcony', 'Modern 2-bedroom apartment with scenic park views. Includes modular kitchen, high-speed fiber internet, refrigerator, and power backup. 5 mins walk to IIT Delhi main gate.', 'New Delhi', 'Hauz Khas', 'C-18, Hauz Khas Enclave, New Delhi', 9500.00, 19000.00, 'SHARED', 'FULLY_FURNISHED', 'MALE_ONLY', '2026-11-05', 'AVAILABLE', 'APPROVED', 'Non-smoking premises. Mutual respect for flatmates study timings. Timely rent payment.'),
(3, 3, 'Safe Girls PG with Home-Style Meals', 'Cozy, high-security student residence near North Campus with CCTV monitoring, 3 daily home-cooked nutritious meals, laundry, and daily housekeeping. Walking distance to Miranda House and SRCC.', 'New Delhi', 'North Campus', 'Plot 88, Hudson Lane, Kingsway Camp, New Delhi', 11000.00, 15000.00, 'SHARED', 'FULLY_FURNISHED', 'FEMALE_ONLY', '2026-11-01', 'AVAILABLE', 'APPROVED', 'Curfew 10:00 PM for safety. No male visitors allowed on residential floors. Mess timings to be respected.'),
(4, 3, 'Independent 1BHK Student Apartment in GTB Nagar', 'Newly renovated 1-bedroom flat with modern interiors, private balcony, AC, modular kitchen, and geyser. Ideal for students seeking privacy and focus.', 'New Delhi', 'North Campus', 'House 412, Double Storey, GTB Nagar, New Delhi', 14500.00, 20000.00, 'APARTMENT', 'SEMI_FURNISHED', 'ANY', '2026-11-10', 'AVAILABLE', 'APPROVED', 'Cleanliness must be maintained. No illegal activities. Quiet hours 11 PM to 7 AM.'),
(5, 2, 'Budget-Friendly Single Room in Saket', 'Economical private single room with cupboard, study table, fan, and shared clean washroom. Near Saket Metro Station and shopping centers.', 'New Delhi', 'Saket', 'Lane 4, Western Marg, Saidulajab, Saket, New Delhi', 7500.00, 10000.00, 'PRIVATE', 'SEMI_FURNISHED', 'ANY', '2026-11-01', 'AVAILABLE', 'APPROVED', 'Electricity billed separately by sub-meter. Non-destructive usage of furniture.')
ON DUPLICATE KEY UPDATE title=title;

-- Insert Accommodation Images
INSERT INTO accommodation_images (accommodation_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop', true),
(1, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&fit=crop', false),
(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop', true),
(2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop', false),
(3, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop', true),
(3, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&fit=crop', false),
(4, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&fit=crop', true),
(5, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=800&fit=crop', true)
ON DUPLICATE KEY UPDATE image_url=image_url;

-- Insert Accommodation Amenities
INSERT INTO accommodation_amenities (accommodation_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 7), (1, 8),
(2, 1), (2, 4), (2, 6), (2, 9), (2, 11),
(3, 1), (3, 2), (3, 3), (3, 5), (3, 6), (3, 8), (3, 10),
(4, 1), (4, 2), (4, 3), (4, 7), (4, 11),
(5, 1), (5, 4), (5, 5)
ON DUPLICATE KEY UPDATE accommodation_id=accommodation_id;

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, content, type, is_read, reference_id, reference_type) VALUES
(4, 'Welcome to ROOMMATE!', 'Your student profile is active. Start exploring compatible roommates and verified student accommodations.', 'SYSTEM', false, NULL, NULL),
(2, 'Listing Approved', 'Your listing "Luxury Studio Room near Hauz Khas Metro" has been approved and is now live on the platform.', 'MODERATION', true, 1, 'ACCOMMODATION')
ON DUPLICATE KEY UPDATE title=title;
