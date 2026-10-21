-- ==============================================================================
-- Techneyo Solutions Migration: Add Dual-Currency (USD) & Services Columns
-- File: migrations/20261022_add_dual_currency_usd_columns.sql
-- Description: Adds USD pricing and missing service fields to MySQL database.
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10+ (phpMyAdmin / cPanel / CLI)
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Method A: Idempotent Execution (Safe to run multiple times without duplicate errors)
-- ------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;
DELIMITER $$
CREATE PROCEDURE AddColumnIfNotExists(
    IN p_table VARCHAR(64),
    IN p_column VARCHAR(64),
    IN p_definition VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = p_table
        AND COLUMN_NAME = p_column
    ) THEN
        SET @s = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

-- 1. Offers Table: USD Pricing Fields
CALL AddColumnIfNotExists('offers', 'starting_price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `starting_price`');
CALL AddColumnIfNotExists('offers', 'discount_price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `discount_price`');
CALL AddColumnIfNotExists('offers', 'setup_fee_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `setup_fee`');
CALL AddColumnIfNotExists('offers', 'booking_amount_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `booking_amount`');

-- 2. Services Table: Starting Prices & SEO Fields
CALL AddColumnIfNotExists('services', 'slug', 'VARCHAR(191) DEFAULT NULL AFTER `title`');
CALL AddColumnIfNotExists('services', 'starting_price', 'DECIMAL(10,2) DEFAULT NULL');
CALL AddColumnIfNotExists('services', 'starting_price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `starting_price`');
CALL AddColumnIfNotExists('services', 'seo_title', 'VARCHAR(255) DEFAULT NULL');
CALL AddColumnIfNotExists('services', 'seo_description', 'TEXT DEFAULT NULL');
CALL AddColumnIfNotExists('services', 'target_keywords', 'TEXT DEFAULT NULL');

-- 3. Service Packages Table: USD Package Prices
CALL AddColumnIfNotExists('service_packages', 'price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `price`');
CALL AddColumnIfNotExists('service_packages', 'offer_price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `offer_price`');

-- 4. Digital Tools Table: USD Starting Price
CALL AddColumnIfNotExists('digital_tools', 'starting_price_usd', 'DECIMAL(10,2) DEFAULT NULL AFTER `starting_price`');

-- 5. Offer Bookings Table: Currency Tracker
CALL AddColumnIfNotExists('offer_bookings', 'currency', 'VARCHAR(10) DEFAULT \'INR\' AFTER `advance_amount_paid`');

DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- End of Migration
-- ==============================================================================
