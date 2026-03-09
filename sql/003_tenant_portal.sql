-- Migration 003: Tenant Portal
-- Adds password auth for tenants, maintenance requests, and payment history

-- Add password_hash to tenants (nullable — existing tenants won't have a password until admin sets one)
ALTER TABLE tenants ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL;

-- Maintenance requests submitted by tenants
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('plumbing','electrical','hvac','appliance','structural','pest_control','landscaping','other') NOT NULL DEFAULT 'other',
    priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
    status ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mr_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_mr_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    INDEX idx_mr_tenant (tenant_id),
    INDEX idx_mr_property (property_id),
    INDEX idx_mr_status (status)
);

-- Payment history records
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_type ENUM('rent','deposit','late_fee','other') NOT NULL DEFAULT 'rent',
    status ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_lease FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    INDEX idx_pay_lease (lease_id),
    INDEX idx_pay_tenant (tenant_id),
    INDEX idx_pay_property (property_id),
    INDEX idx_pay_date (payment_date),
    INDEX idx_pay_status (status)
);
