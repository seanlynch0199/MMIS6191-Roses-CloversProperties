-- Roses & Clovers Properties Database Schema
-- Run this file to create all required tables

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS leases;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS audit_log;

-- Properties table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    property_type ENUM('apartment', 'house', 'duplex', 'condo', 'townhouse', 'studio') NOT NULL DEFAULT 'apartment',
    bedrooms INT NOT NULL DEFAULT 1,
    bathrooms DECIMAL(3,1) NOT NULL DEFAULT 1.0,
    square_feet INT DEFAULT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    available_date DATE DEFAULT NULL,
    description TEXT,
    amenities JSON DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_available (available),
    INDEX idx_property_type (property_type),
    INDEX idx_monthly_rent (monthly_rent),
    INDEX idx_bedrooms (bedrooms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tenants table
CREATE TABLE tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    emergency_contact_name VARCHAR(200) DEFAULT NULL,
    emergency_contact_phone VARCHAR(20) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leases table
CREATE TABLE leases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT NULL,
    status ENUM('upcoming', 'active', 'ended', 'terminated') NOT NULL DEFAULT 'upcoming',
    payment_due_day INT NOT NULL DEFAULT 1,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    INDEX idx_property (property_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    CONSTRAINT chk_dates CHECK (end_date > start_date),
    CONSTRAINT chk_payment_day CHECK (payment_due_day >= 1 AND payment_due_day <= 28)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log table (optional but recommended)
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    details JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
