import fs from "fs";
import path from "path";

const dump = JSON.parse(fs.readFileSync("supabase_dump.json", "utf-8"));

function escapeSql(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number") return val.toString();
  if (typeof val === "object") {
    // Array or JSON object
    return `'${JSON.stringify(val).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
  }
  // String
  return `'${val.toString().replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function generateInserts(tableName, rows) {
  if (!rows || rows.length === 0) return "";
  const lines = [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const cols = keys.map((k) => `\`${k}\``).join(", ");
    const vals = keys.map((k) => escapeSql(row[k])).join(", ");
    lines.push(
      `INSERT INTO \`${tableName}\` (${cols}) VALUES (${vals}) ON DUPLICATE KEY UPDATE \`updated_at\` = CURRENT_TIMESTAMP;`
    );
  }
  return lines.join("\n") + "\n\n";
}

let sql = `-- Techneyo Solutions MySQL Migration & Seed Script
-- Generated automatically for transition from Supabase PostgreSQL to MySQL
-- Usage: mysql -u <user> -p <database_name> < migrations/init_mysql.sql

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- 1. Table: admin_users
CREATE TABLE IF NOT EXISTS \`admin_users\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(255) DEFAULT NULL,
  \`role\` ENUM('owner', 'admin', 'manager', 'viewer') NOT NULL DEFAULT 'admin',
  \`must_change_password\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: app_settings
CREATE TABLE IF NOT EXISTS \`app_settings\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`coverage_text\` TEXT DEFAULT NULL,
  \`service_area\` VARCHAR(255) DEFAULT 'All India',
  \`city_targets\` JSON DEFAULT NULL,
  \`state_targets\` JSON DEFAULT NULL,
  \`location_based_offers_enabled\` TINYINT(1) DEFAULT 0,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`business_name\` VARCHAR(255) DEFAULT 'Techneyo Solutions',
  \`business_email\` VARCHAR(255) DEFAULT 'hello@techneyo.com',
  \`business_phone\` VARCHAR(50) DEFAULT '+91 99887 73122',
  \`business_website\` VARCHAR(255) DEFAULT 'https://techneyo.com',
  \`whatsapp_url\` VARCHAR(255) DEFAULT 'https://wa.me/919988773122',
  \`razorpay_mode\` VARCHAR(50) DEFAULT 'test',
  \`razorpay_test_key_id\` VARCHAR(255) DEFAULT NULL,
  \`razorpay_test_key_secret\` VARCHAR(255) DEFAULT NULL,
  \`razorpay_live_key_id\` VARCHAR(255) DEFAULT NULL,
  \`razorpay_live_key_secret\` VARCHAR(255) DEFAULT NULL,
  \`resend_api_key\` VARCHAR(255) DEFAULT NULL,
  \`notification_sender_email\` VARCHAR(255) DEFAULT NULL,
  \`email_notifications_enabled\` TINYINT(1) DEFAULT 1,
  \`smtp_enabled\` TINYINT(1) DEFAULT 1,
  \`smtp_host\` VARCHAR(255) DEFAULT NULL,
  \`smtp_port\` INT DEFAULT 587,
  \`smtp_user\` VARCHAR(255) DEFAULT NULL,
  \`smtp_pass\` VARCHAR(255) DEFAULT NULL,
  \`smtp_from_email\` VARCHAR(255) DEFAULT 'hello@techneyo.com',
  \`smtp_from_name\` VARCHAR(255) DEFAULT 'Techneyo Solutions',
  \`email_provider\` VARCHAR(50) DEFAULT 'brevo',
  \`email_api_key\` VARCHAR(255) DEFAULT NULL,
  \`emailjs_service_id\` VARCHAR(255) DEFAULT NULL,
  \`emailjs_template_id\` VARCHAR(255) DEFAULT NULL,
  \`emailjs_public_key\` VARCHAR(255) DEFAULT NULL,
  \`payment_required\` TINYINT(1) DEFAULT 0,
  \`slack_enabled\` TINYINT(1) DEFAULT 0,
  \`slack_webhook_url\` TEXT DEFAULT NULL,
  \`slack_channel\` VARCHAR(100) DEFAULT '#leads',
  \`slack_notify_enquiries\` TINYINT(1) DEFAULT 1,
  \`slack_notify_bookings\` TINYINT(1) DEFAULT 1,
  \`slack_notify_proposals\` TINYINT(1) DEFAULT 1,
  \`slack_notify_onboarding\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: offers
CREATE TABLE IF NOT EXISTS \`offers\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) UNIQUE DEFAULT NULL,
  \`short_description\` TEXT DEFAULT NULL,
  \`detailed_description\` TEXT DEFAULT NULL,
  \`offer_type\` VARCHAR(100) NOT NULL,
  \`starting_price\` DECIMAL(10,2) DEFAULT NULL,
  \`discount_price\` DECIMAL(10,2) DEFAULT NULL,
  \`billing_period\` VARCHAR(50) DEFAULT 'monthly',
  \`setup_fee\` DECIMAL(10,2) DEFAULT NULL,
  \`booking_amount_type\` VARCHAR(50) DEFAULT 'fixed',
  \`booking_amount\` DECIMAL(10,2) DEFAULT NULL,
  \`target_audience\` JSON DEFAULT NULL,
  \`whats_included\` JSON DEFAULT NULL,
  \`whats_not_included\` JSON DEFAULT NULL,
  \`update_policy\` TEXT DEFAULT NULL,
  \`ownership_policy\` TEXT DEFAULT NULL,
  \`terms\` JSON DEFAULT NULL,
  \`target_keywords\` JSON DEFAULT NULL,
  \`valid_from\` DATE DEFAULT NULL,
  \`valid_till\` DATE DEFAULT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'Draft',
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`button_text\` VARCHAR(100) NOT NULL DEFAULT 'Enquire Now',
  \`button_action\` VARCHAR(100) NOT NULL DEFAULT 'Contact Form',
  \`button_url\` TEXT DEFAULT NULL,
  \`display_order\` INT NOT NULL DEFAULT 0,
  \`banner_image_url\` TEXT DEFAULT NULL,
  \`seo_title\` VARCHAR(255) DEFAULT NULL,
  \`seo_description\` TEXT DEFAULT NULL,
  \`created_by\` VARCHAR(36) DEFAULT NULL,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: services
CREATE TABLE IF NOT EXISTS \`services\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`icon_name\` VARCHAR(100) NOT NULL DEFAULT 'Globe',
  \`features\` JSON DEFAULT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'active',
  \`display_order\` INT NOT NULL DEFAULT 0,
  \`created_by\` VARCHAR(36) DEFAULT NULL,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: service_packages
CREATE TABLE IF NOT EXISTS \`service_packages\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`price\` DECIMAL(10,2) DEFAULT NULL,
  \`offer_price\` DECIMAL(10,2) DEFAULT NULL,
  \`features\` JSON DEFAULT NULL,
  \`best_for\` TEXT DEFAULT NULL,
  \`delivery_timeline\` VARCHAR(100) DEFAULT NULL,
  \`is_recommended\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'active',
  \`display_order\` INT NOT NULL DEFAULT 0,
  \`created_by\` VARCHAR(36) DEFAULT NULL,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: digital_tools
CREATE TABLE IF NOT EXISTS \`digital_tools\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`business_use_case\` TEXT DEFAULT NULL,
  \`starting_price\` DECIMAL(10,2) DEFAULT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'active',
  \`cta_type\` VARCHAR(100) NOT NULL DEFAULT 'Contact Form',
  \`cta_url\` TEXT DEFAULT NULL,
  \`display_order\` INT NOT NULL DEFAULT 0,
  \`created_by\` VARCHAR(36) DEFAULT NULL,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: blogs
CREATE TABLE IF NOT EXISTS \`blogs\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`excerpt\` TEXT NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`category\` VARCHAR(100) NOT NULL DEFAULT 'Web Development',
  \`tags\` JSON DEFAULT NULL,
  \`cover_image\` MEDIUMTEXT DEFAULT NULL,
  \`author_name\` VARCHAR(255) NOT NULL DEFAULT 'Techneyo Team',
  \`author_role\` VARCHAR(255) NOT NULL DEFAULT 'Technical Growth Specialist',
  \`reading_time\` VARCHAR(50) NOT NULL DEFAULT '5 min read',
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'Published',
  \`is_featured\` TINYINT(1) DEFAULT 0,
  \`seo_title\` VARCHAR(255) DEFAULT NULL,
  \`seo_description\` TEXT DEFAULT NULL,
  \`view_count\` INT DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: portfolio_clients
CREATE TABLE IF NOT EXISTS \`portfolio_clients\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`company_name\` VARCHAR(255) NOT NULL,
  \`company_logo_url\` MEDIUMTEXT DEFAULT NULL,
  \`company_description\` TEXT NOT NULL,
  \`company_website_url\` TEXT DEFAULT NULL,
  \`projects\` JSON DEFAULT NULL,
  \`display_order\` INT NOT NULL DEFAULT 0,
  \`created_by\` VARCHAR(36) DEFAULT NULL,
  \`updated_by\` VARCHAR(36) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: contact_enquiries
CREATE TABLE IF NOT EXISTS \`contact_enquiries\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`email\` VARCHAR(255) DEFAULT NULL,
  \`business_name\` VARCHAR(255) DEFAULT NULL,
  \`city\` VARCHAR(100) DEFAULT NULL,
  \`state\` VARCHAR(100) DEFAULT NULL,
  \`service_required\` VARCHAR(255) DEFAULT NULL,
  \`budget_range\` VARCHAR(100) DEFAULT NULL,
  \`message\` TEXT DEFAULT NULL,
  \`source_page\` VARCHAR(255) DEFAULT NULL,
  \`source_page_url\` TEXT DEFAULT NULL,
  \`landing_page_url\` TEXT DEFAULT NULL,
  \`initial_referrer\` TEXT DEFAULT NULL,
  \`referrer\` TEXT DEFAULT NULL,
  \`selected_offer_id\` VARCHAR(36) DEFAULT NULL,
  \`selected_package_id\` VARCHAR(36) DEFAULT NULL,
  \`utm_source\` VARCHAR(255) DEFAULT NULL,
  \`utm_medium\` VARCHAR(255) DEFAULT NULL,
  \`utm_campaign\` VARCHAR(255) DEFAULT NULL,
  \`utm_term\` VARCHAR(255) DEFAULT NULL,
  \`utm_content\` VARCHAR(255) DEFAULT NULL,
  \`device_type\` VARCHAR(100) DEFAULT NULL,
  \`ip_address\` VARCHAR(45) DEFAULT NULL,
  \`user_agent\` TEXT DEFAULT NULL,
  \`lead_status\` VARCHAR(50) NOT NULL DEFAULT 'new',
  \`admin_notes\` TEXT DEFAULT NULL,
  \`follow_up_date\` DATE DEFAULT NULL,
  \`archived_at\` TIMESTAMP NULL DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_lead_status\` (\`lead_status\`),
  INDEX \`idx_created_at\` (\`created_at\` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: offer_bookings
CREATE TABLE IF NOT EXISTS \`offer_bookings\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`offer_id\` VARCHAR(36) DEFAULT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`customer_email\` VARCHAR(255) NOT NULL,
  \`customer_phone\` VARCHAR(50) NOT NULL,
  \`business_name\` VARCHAR(255) DEFAULT NULL,
  \`total_plan_price\` DECIMAL(10,2) DEFAULT NULL,
  \`advance_amount_paid\` DECIMAL(10,2) NOT NULL,
  \`razorpay_order_id\` VARCHAR(255) DEFAULT NULL,
  \`razorpay_payment_id\` VARCHAR(255) DEFAULT NULL,
  \`razorpay_signature\` TEXT DEFAULT NULL,
  \`payment_status\` VARCHAR(50) NOT NULL DEFAULT 'paid',
  \`onboarding_status\` VARCHAR(50) NOT NULL DEFAULT 'pending',
  \`onboarding_details\` JSON DEFAULT NULL,
  \`utm_source\` VARCHAR(255) DEFAULT NULL,
  \`utm_medium\` VARCHAR(255) DEFAULT NULL,
  \`utm_campaign\` VARCHAR(255) DEFAULT NULL,
  \`utm_term\` VARCHAR(255) DEFAULT NULL,
  \`utm_content\` VARCHAR(255) DEFAULT NULL,
  \`source_page_url\` TEXT DEFAULT NULL,
  \`landing_page_url\` TEXT DEFAULT NULL,
  \`initial_referrer\` TEXT DEFAULT NULL,
  \`referrer\` TEXT DEFAULT NULL,
  \`device_type\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_payment_status\` (\`payment_status\`),
  INDEX \`idx_onboarding_status\` (\`onboarding_status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: analytics_events
CREATE TABLE IF NOT EXISTS \`analytics_events\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`event_name\` VARCHAR(255) NOT NULL,
  \`page_path\` VARCHAR(255) NOT NULL,
  \`page_title\` VARCHAR(255) DEFAULT NULL,
  \`utm_source\` VARCHAR(255) DEFAULT NULL,
  \`utm_medium\` VARCHAR(255) DEFAULT NULL,
  \`utm_campaign\` VARCHAR(255) DEFAULT NULL,
  \`utm_term\` VARCHAR(255) DEFAULT NULL,
  \`utm_content\` VARCHAR(255) DEFAULT NULL,
  \`referrer\` TEXT DEFAULT NULL,
  \`device_type\` VARCHAR(100) DEFAULT NULL,
  \`session_id\` VARCHAR(255) DEFAULT NULL,
  \`event_properties\` JSON DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_analytics_event\` (\`event_name\`),
  INDEX \`idx_analytics_created\` (\`created_at\` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: activity_logs
CREATE TABLE IF NOT EXISTS \`activity_logs\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`admin_id\` VARCHAR(36) DEFAULT NULL,
  \`action_type\` VARCHAR(100) NOT NULL,
  \`module_name\` VARCHAR(100) NOT NULL,
  \`record_id\` VARCHAR(36) DEFAULT NULL,
  \`old_value\` JSON DEFAULT NULL,
  \`new_value\` JSON DEFAULT NULL,
  \`ip_address\` VARCHAR(45) DEFAULT NULL,
  \`user_agent\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Seed Initial Admin: admin@techneyo.com (Password: Admin@Techneyo2026!)
-- -------------------------------------------------------------
INSERT INTO \`admin_users\` (\`id\`, \`email\`, \`password_hash\`, \`full_name\`, \`role\`, \`must_change_password\`, \`is_active\`)
VALUES (
  'a2644ba4-20f4-45f1-8cee-a0ed1f11ae4a',
  'admin@techneyo.com',
  '$2b$10$xKmjyCajhAbb23cQCvOe4enmVtHWTWC31xZjXskNVdci0KX4dnMI.',
  'Techneyo Admin',
  'owner',
  0,
  1
) ON DUPLICATE KEY UPDATE \`email\` = VALUES(\`email\`);

-- -------------------------------------------------------------
-- Data Migrated Directly from Supabase
-- -------------------------------------------------------------
`;

sql += "-- Migrated App Settings\n";
sql += generateInserts("app_settings", dump.app_settings);

sql += "-- Migrated Offers\n";
sql += generateInserts("offers", dump.offers);

sql += "-- Migrated Services\n";
sql += generateInserts("services", dump.services);

sql += "-- Migrated Blogs\n";
sql += generateInserts("blogs", dump.blogs);

sql += "-- Migrated Portfolio Clients\n";
sql += generateInserts("portfolio_clients", dump.portfolio_clients);

sql += "-- Migrated Offer Bookings\n";
sql += generateInserts("offer_bookings", dump.offer_bookings);

sql += "SET FOREIGN_KEY_CHECKS = 1;\n";

fs.mkdirSync("migrations", { recursive: true });
fs.writeFileSync("migrations/init_mysql.sql", sql);
console.log("Written migrations/init_mysql.sql successfully, file size:", fs.statSync("migrations/init_mysql.sql").size);
