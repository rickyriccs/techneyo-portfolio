-- Migration: Create client_needs_assessments table in MySQL
-- Date: 2026-11-05

CREATE TABLE IF NOT EXISTS `client_needs_assessments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `customer_name` VARCHAR(255) DEFAULT NULL,
  `customer_email` VARCHAR(255) DEFAULT NULL,
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `business_name` VARCHAR(255) DEFAULT NULL,
  `industry` VARCHAR(100) NOT NULL,
  `industry_name` VARCHAR(255) DEFAULT NULL,
  `bottleneck` VARCHAR(255) NOT NULL,
  `bottleneck_title` VARCHAR(255) DEFAULT NULL,
  `digital_status` VARCHAR(255) NOT NULL,
  `timeline` VARCHAR(100) NOT NULL,
  `urgency_score` INT NOT NULL DEFAULT 50,
  `urgency_level` ENUM('Critical', 'Moderate', 'Optimization') NOT NULL DEFAULT 'Moderate',
  `recommended_offer_id` VARCHAR(36) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `answers` JSON DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_client_needs_urgency` (`urgency_level`),
  INDEX `idx_client_needs_status` (`status`),
  INDEX `idx_client_needs_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
