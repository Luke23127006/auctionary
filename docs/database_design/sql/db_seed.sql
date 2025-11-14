-- ============================================
-- Online Auction System - Database Seed Data
-- DBMS: PostgreSQL 13+ (Supabase Compatible)
-- Note: Run this after db_init.sql
-- ============================================

-- ============================================
-- 1. SEED USERS
-- ============================================

-- Insert test users (password: 'password123' hashed with bcrypt)
-- bcrypt hash: $2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X
INSERT INTO users (full_name, email, password, status) VALUES
('Admin User', 'admin@auction.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active'),
('John Seller', 'john.seller@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active'),
('Jane Bidder', 'jane.bidder@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active'),
('Bob Smith', 'bob.smith@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active'),
('Alice Johnson', 'alice.johnson@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active'),
('Charlie Brown', 'charlie.brown@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'pending_verification'),
('David Lee', 'david.lee@example.com', '$2a$10$rK4qJ9Z9X9X9X9X9X9X9XeuK4qJ9Z9X9X9X9X9X9X9X9X9X9X9X9X', 'active');

-- ============================================
-- 2. ASSIGN ROLES TO USERS
-- ============================================

-- Get role IDs (already created in db_init.sql)
-- Admin role to user 1
INSERT INTO users_roles (user_id, role_id)
SELECT 1, role_id FROM roles WHERE name = 'admin';

-- Seller role to users 2
INSERT INTO users_roles (user_id, role_id)
SELECT 2, role_id FROM roles WHERE name = 'seller';

-- Bidder role to users 3, 4, 5, 7
INSERT INTO users_roles (user_id, role_id)
SELECT user_id, role_id 
FROM (VALUES (3), (4), (5), (7)) AS users(user_id)
CROSS JOIN roles 
WHERE roles.name = 'bidder';

-- User 2 (John Seller) also has bidder role
INSERT INTO users_roles (user_id, role_id)
SELECT 2, role_id FROM roles WHERE name = 'bidder';

-- ============================================
-- 3. SEED CATEGORIES
-- ============================================

-- Parent categories (2-level hierarchy)
INSERT INTO categories (name, slug, parent_id) VALUES
('Electronics', 'electronics', NULL),
('Fashion', 'fashion', NULL),
('Home & Garden', 'home-garden', NULL),
('Sports', 'sports', NULL),
('Books', 'books', NULL),
('Collectibles', 'collectibles', NULL);

-- Child categories (must reference parent)
INSERT INTO categories (name, slug, parent_id) VALUES
-- Electronics children
('Smartphones', 'smartphones', (SELECT category_id FROM categories WHERE slug = 'electronics')),
('Laptops', 'laptops', (SELECT category_id FROM categories WHERE slug = 'electronics')),
('Cameras', 'cameras', (SELECT category_id FROM categories WHERE slug = 'electronics')),
('Gaming Consoles', 'gaming-consoles', (SELECT category_id FROM categories WHERE slug = 'electronics')),

-- Fashion children
('Men Clothing', 'men-clothing', (SELECT category_id FROM categories WHERE slug = 'fashion')),
('Women Clothing', 'women-clothing', (SELECT category_id FROM categories WHERE slug = 'fashion')),
('Watches', 'watches', (SELECT category_id FROM categories WHERE slug = 'fashion')),
('Shoes', 'shoes', (SELECT category_id FROM categories WHERE slug = 'fashion')),

-- Home & Garden children
('Furniture', 'furniture', (SELECT category_id FROM categories WHERE slug = 'home-garden')),
('Kitchen Appliances', 'kitchen-appliances', (SELECT category_id FROM categories WHERE slug = 'home-garden')),
('Garden Tools', 'garden-tools', (SELECT category_id FROM categories WHERE slug = 'home-garden')),

-- Sports children
('Fitness Equipment', 'fitness-equipment', (SELECT category_id FROM categories WHERE slug = 'sports')),
('Bicycles', 'bicycles', (SELECT category_id FROM categories WHERE slug = 'sports')),
('Outdoor Gear', 'outdoor-gear', (SELECT category_id FROM categories WHERE slug = 'sports')),

-- Books children
('Fiction', 'fiction', (SELECT category_id FROM categories WHERE slug = 'books')),
('Non-Fiction', 'non-fiction', (SELECT category_id FROM categories WHERE slug = 'books')),
('Textbooks', 'textbooks', (SELECT category_id FROM categories WHERE slug = 'books')),

-- Collectibles children
('Vintage Items', 'vintage-items', (SELECT category_id FROM categories WHERE slug = 'collectibles')),
('Art', 'art', (SELECT category_id FROM categories WHERE slug = 'collectibles')),
('Coins & Stamps', 'coins-stamps', (SELECT category_id FROM categories WHERE slug = 'collectibles'));

-- ============================================
-- 4. SEED PRODUCTS (ACTIVE AUCTIONS)
-- ============================================

INSERT INTO products (
    category_id, 
    seller_id, 
    name, 
    thumbnail_url,
    current_price, 
    buy_now_price,
    start_price, 
    step_price,
    start_time,
    end_time,
    auto_extend,
    status
) VALUES
-- Product 1: iPhone 14 Pro
(
    (SELECT category_id FROM categories WHERE slug = 'smartphones'),
    2, -- John Seller
    'iPhone 14 Pro 256GB - Space Black',
    'https://example.com/images/iphone14pro.jpg',
    800.00,
    1200.00,
    750.00,
    50.00,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP + INTERVAL '5 days',
    TRUE,
    'active'
),
-- Product 2: MacBook Pro
(
    (SELECT category_id FROM categories WHERE slug = 'laptops'),
    2, -- John Seller
    'MacBook Pro M2 16" - 512GB SSD',
    'https://example.com/images/macbookpro.jpg',
    1500.00,
    2500.00,
    1400.00,
    100.00,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '6 days',
    TRUE,
    'active'
),
-- Product 3: Canon Camera
(
    (SELECT category_id FROM categories WHERE slug = 'cameras'),
    2, -- John Seller
    'Canon EOS R6 Mark II - Body Only',
    'https://example.com/images/canonr6.jpg',
    2000.00,
    2800.00,
    1900.00,
    100.00,
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    TRUE,
    'active'
),
-- Product 4: Vintage Watch
(
    (SELECT category_id FROM categories WHERE slug = 'watches'),
    2, -- John Seller
    'Rolex Submariner Vintage 1980s',
    'https://example.com/images/rolex.jpg',
    5000.00,
    8000.00,
    4500.00,
    250.00,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '10 days',
    FALSE,
    'active'
),
-- Product 5: Gaming Console
(
    (SELECT category_id FROM categories WHERE slug = 'gaming-consoles'),
    2, -- John Seller
    'PlayStation 5 Digital Edition - Like New',
    'https://example.com/images/ps5.jpg',
    400.00,
    550.00,
    350.00,
    25.00,
    CURRENT_TIMESTAMP - INTERVAL '4 days',
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    TRUE,
    'active'
);

-- ============================================
-- 5. SEED PRODUCT DESCRIPTIONS
-- ============================================

INSERT INTO product_descriptions (product_id, author_id, content, lang, version) VALUES
(1, 2, 'Brand new iPhone 14 Pro in Space Black. 256GB storage, unlocked, includes original box and accessories. Perfect condition, never used.', 'en', 1),
(2, 2, 'MacBook Pro 16" with M2 chip, 16GB RAM, 512GB SSD. Lightly used for 6 months, excellent condition. Includes charger and original packaging.', 'en', 1),
(3, 2, 'Canon EOS R6 Mark II mirrorless camera body. Professional grade, low shutter count (2000 actuations). Perfect for photographers upgrading from DSLR.', 'en', 1),
(4, 2, 'Authentic Rolex Submariner from 1980s. Serviced recently, keeps excellent time. Comes with papers and service history. A true collector''s piece.', 'en', 1),
(5, 2, 'PlayStation 5 Digital Edition in excellent condition. Used for 3 months, adult-owned, smoke-free home. Includes one controller and cables.', 'en', 1);

-- ============================================
-- 6. SEED PRODUCT IMAGES
-- ============================================

INSERT INTO product_images (product_id, image_url) VALUES
-- iPhone images
(1, 'https://example.com/images/iphone14pro-1.jpg'),
(1, 'https://example.com/images/iphone14pro-2.jpg'),
(1, 'https://example.com/images/iphone14pro-3.jpg'),
-- MacBook images
(2, 'https://example.com/images/macbookpro-1.jpg'),
(2, 'https://example.com/images/macbookpro-2.jpg'),
-- Camera images
(3, 'https://example.com/images/canonr6-1.jpg'),
(3, 'https://example.com/images/canonr6-2.jpg'),
(3, 'https://example.com/images/canonr6-3.jpg'),
-- Watch images
(4, 'https://example.com/images/rolex-1.jpg'),
(4, 'https://example.com/images/rolex-2.jpg'),
-- PS5 images
(5, 'https://example.com/images/ps5-1.jpg'),
(5, 'https://example.com/images/ps5-2.jpg');

-- ============================================
-- 7. SEED BIDS
-- ============================================

-- Bids on iPhone (product 1)
INSERT INTO bids (product_id, bidder_id, amount, is_auto) VALUES
(1, 3, 750.00, FALSE), -- Jane's first bid (start price)
(1, 4, 800.00, FALSE), -- Bob outbids
(1, 5, 850.00, FALSE); -- Alice current highest

-- Bids on MacBook (product 2)
INSERT INTO bids (product_id, bidder_id, amount, is_auto) VALUES
(2, 3, 1400.00, FALSE), -- Jane's bid
(2, 4, 1500.00, FALSE); -- Bob current highest

-- Bids on Camera (product 3)
INSERT INTO bids (product_id, bidder_id, amount, is_auto) VALUES
(3, 5, 1900.00, FALSE), -- Alice's first bid
(3, 3, 2000.00, FALSE); -- Jane current highest

-- Bids on Watch (product 4)
INSERT INTO bids (product_id, bidder_id, amount, is_auto) VALUES
(4, 7, 4500.00, FALSE), -- David's bid
(4, 5, 4750.00, FALSE), -- Alice outbids
(4, 7, 5000.00, FALSE); -- David current highest

-- ============================================
-- 8. SEED AUTO BIDS
-- ============================================

INSERT INTO auto_bids (product_id, bidder_id, max_amount) VALUES
(1, 3, 1000.00), -- Jane will auto-bid up to $1000 on iPhone
(2, 5, 2000.00), -- Alice will auto-bid up to $2000 on MacBook
(3, 4, 2500.00); -- Bob will auto-bid up to $2500 on Camera

-- ============================================
-- 9. SEED WATCHLIST
-- ============================================

INSERT INTO watchlist (user_id, product_id) VALUES
(3, 1), -- Jane watching iPhone
(3, 2), -- Jane watching MacBook
(4, 1), -- Bob watching iPhone
(4, 3), -- Bob watching Camera
(5, 1), -- Alice watching iPhone
(5, 4), -- Alice watching Watch
(7, 4); -- David watching Watch

-- ============================================
-- 10. SEED PRODUCT COMMENTS
-- ============================================

INSERT INTO product_comments (product_id, user_id, content, parent_id) VALUES
-- Comments on iPhone
(1, 3, 'Is this unlocked for all carriers?', NULL),
(1, 2, 'Yes, it is factory unlocked and works with all carriers worldwide.', 
    (SELECT comment_id FROM product_comments WHERE product_id = 1 AND user_id = 3 LIMIT 1)),
(1, 4, 'What is the battery health percentage?', NULL),
(1, 2, 'Battery health is 100% as it is brand new.', 
    (SELECT comment_id FROM product_comments WHERE product_id = 1 AND user_id = 4 LIMIT 1)),

-- Comments on MacBook
(2, 3, 'Does this have AppleCare+?', NULL),
(2, 2, 'Yes, AppleCare+ is valid until 2025.', 
    (SELECT comment_id FROM product_comments WHERE product_id = 2 AND user_id = 3 LIMIT 1)),

-- Comments on Camera
(3, 5, 'Any scratches on the sensor or body?', NULL),
(3, 2, 'Sensor is pristine, body has minor wear on bottom plate from tripod use.', 
    (SELECT comment_id FROM product_comments WHERE product_id = 3 AND user_id = 5 LIMIT 1));

-- ============================================
-- 11. SEED COMPLETED ORDERS (FOR DEMO)
-- ============================================

-- Insert a sold product first
INSERT INTO products (
    category_id, 
    seller_id, 
    highest_bidder_id,
    name, 
    current_price, 
    start_price, 
    step_price,
    start_time,
    end_time,
    bid_count,
    status
) VALUES
(
    (SELECT category_id FROM categories WHERE slug = 'laptops'),
    2, -- John Seller
    3, -- Jane won
    'Dell XPS 15 - 1TB SSD',
    1200.00,
    1000.00,
    50.00,
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    CURRENT_TIMESTAMP - INTERVAL '8 days',
    12,
    'sold'
);

-- Create order for sold product
INSERT INTO orders (product_id, winner_id, seller_id, final_price, status) VALUES
(
    (SELECT product_id FROM products WHERE name LIKE 'Dell XPS%' LIMIT 1),
    3, -- Jane (winner)
    2, -- John (seller)
    1200.00,
    'completed'
);

-- Create invoice for the order
INSERT INTO invoices (order_id, shipping_address, payment_proof_url, shipping_tracking_code) VALUES
(
    (SELECT order_id FROM orders WHERE winner_id = 3 LIMIT 1),
    '123 Main St, San Francisco, CA 94102, USA',
    'https://example.com/payment-proof-12345.pdf',
    'UPS-1234567890'
);

-- ============================================
-- 12. SEED REVIEWS
-- ============================================

-- Jane reviews John (seller) - positive
INSERT INTO reviews (order_id, reviewer_id, reviewered_id, rating, content) VALUES
(
    (SELECT order_id FROM orders WHERE winner_id = 3 LIMIT 1),
    3, -- Jane (reviewer)
    2, -- John (seller being reviewed)
    1, -- Positive
    'Excellent seller! Item was exactly as described, fast shipping, great communication.'
);

-- John reviews Jane (buyer) - positive
INSERT INTO reviews (order_id, reviewer_id, reviewered_id, rating, content) VALUES
(
    (SELECT order_id FROM orders WHERE winner_id = 3 LIMIT 1),
    2, -- John (reviewer)
    3, -- Jane (buyer being reviewed)
    1, -- Positive
    'Great buyer, fast payment, smooth transaction. Highly recommended!'
);

-- ============================================
-- 13. SEED NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, type, content, action_url, is_read) VALUES
-- Jane's notifications
(3, 'bid_outbid', 'You have been outbid on iPhone 14 Pro', '/auction/1', FALSE),
(3, 'auction_ending', 'Auction ending soon: iPhone 14 Pro (5 hours left)', '/auction/1', FALSE),
(3, 'order_completed', 'Your order for Dell XPS 15 has been completed', '/orders/1', TRUE),

-- Bob's notifications
(4, 'bid_placed', 'Your bid on MacBook Pro has been placed successfully', '/auction/2', TRUE),
(4, 'watchlist_ending', 'Watched auction ending soon: iPhone 14 Pro', '/auction/1', FALSE),

-- Alice's notifications
(5, 'bid_outbid', 'You have been outbid on iPhone 14 Pro', '/auction/1', FALSE),
(5, 'new_comment', 'New comment on Canon EOS R6 Mark II', '/auction/3', FALSE),

-- John's (seller) notifications
(2, 'new_bid', 'New bid placed on your iPhone 14 Pro', '/auction/1', TRUE),
(2, 'auction_ending', 'Your auction for PlayStation 5 ending in 24 hours', '/my-auctions', FALSE);

-- ============================================
-- 14. UPDATE USER RATINGS (from reviews)
-- ============================================

-- The triggers should have updated this automatically, but we can verify
UPDATE users 
SET positive_reviews = (
    SELECT COUNT(*) 
    FROM reviews 
    WHERE reviewered_id = users.user_id AND rating = 1
),
negative_reviews = (
    SELECT COUNT(*) 
    FROM reviews 
    WHERE reviewered_id = users.user_id AND rating = -1
);

-- ============================================
-- 15. SEED UPGRADE REQUESTS
-- ============================================

-- Charlie wants to become a seller
INSERT INTO upgrade_requests (user_id, status) VALUES
(6, 'pending'); -- Charlie Brown

-- David already approved
INSERT INTO upgrade_requests (user_id, status, approved_at) VALUES
(7, 'approved', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Add seller role to David after approval
INSERT INTO users_roles (user_id, role_id)
SELECT 7, role_id FROM roles WHERE name = 'seller';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check data counts
DO $$
DECLARE
    user_count INT;
    category_count INT;
    product_count INT;
    bid_count INT;
    review_count INT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO category_count FROM categories;
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO bid_count FROM bids;
    SELECT COUNT(*) INTO review_count FROM reviews;
    
    RAISE NOTICE 'Seed data summary:';
    RAISE NOTICE '- Users: %', user_count;
    RAISE NOTICE '- Categories: %', category_count;
    RAISE NOTICE '- Products: %', product_count;
    RAISE NOTICE '- Bids: %', bid_count;
    RAISE NOTICE '- Reviews: %', review_count;
END $$;

-- Display active auctions
SELECT 
    p.product_id,
    p.name,
    c.name as category,
    u.full_name as seller,
    p.current_price,
    p.bid_count,
    p.end_time - CURRENT_TIMESTAMP as time_remaining
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN users u ON p.seller_id = u.user_id
WHERE p.status = 'active'
ORDER BY p.end_time ASC;

-- ============================================
-- END OF SEED FILE
-- ============================================
