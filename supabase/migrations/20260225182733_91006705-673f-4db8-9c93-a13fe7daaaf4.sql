
-- 1) Clear old pricing rules and insert new ones
DELETE FROM pricing_rules;

-- 0–250 m² (small)
INSERT INTO pricing_rules (garden_size, dog_count_min, dog_count_max, frequency, base_price) VALUES
('small', 1, 99, 'monthly', 45),
('small', 1, 99, 'biweekly', 60),
('small', 1, 99, 'weekly', 80),
('small', 1, 99, 'twice_weekly', 81);

-- 251–750 m² (medium)
INSERT INTO pricing_rules (garden_size, dog_count_min, dog_count_max, frequency, base_price) VALUES
('medium', 1, 99, 'monthly', 60),
('medium', 1, 99, 'biweekly', 85),
('medium', 1, 99, 'weekly', 110),
('medium', 1, 99, 'twice_weekly', 115);

-- 751–1500 m² (large)
INSERT INTO pricing_rules (garden_size, dog_count_min, dog_count_max, frequency, base_price) VALUES
('large', 1, 99, 'monthly', 85),
('large', 1, 99, 'biweekly', 120),
('large', 1, 99, 'weekly', 155),
('large', 1, 99, 'twice_weekly', 160);

-- Dog surcharge rule (configurable by admin)
INSERT INTO pricing_rules (garden_size, dog_count_min, dog_count_max, frequency, base_price) VALUES
('all', 1, 99, 'dog_surcharge', 10);

-- 2) Add columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type text;
