package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

// Token store for admin sessions
var (
	tokenStore = make(map[string]time.Time)
	tokenMutex sync.RWMutex
)

// ============================================================================
// MODELS
// ============================================================================

type Property struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	AddressLine1  string    `json:"addressLine1"`
	AddressLine2  *string   `json:"addressLine2,omitempty"`
	City          string    `json:"city"`
	State         string    `json:"state"`
	Zip           string    `json:"zip"`
	PropertyType  string    `json:"propertyType"`
	Bedrooms      int       `json:"bedrooms"`
	Bathrooms     float64   `json:"bathrooms"`
	SquareFeet    *int      `json:"squareFeet,omitempty"`
	MonthlyRent   float64   `json:"monthlyRent"`
	DepositAmount *float64  `json:"depositAmount,omitempty"`
	Available     bool      `json:"available"`
	AvailableDate *string   `json:"availableDate,omitempty"`
	Description   *string   `json:"description,omitempty"`
	Amenities     []string  `json:"amenities,omitempty"`
	ImageURL      *string   `json:"imageUrl,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type Tenant struct {
	ID                    int       `json:"id"`
	FirstName             string    `json:"firstName"`
	LastName              string    `json:"lastName"`
	Email                 string    `json:"email"`
	Phone                 *string   `json:"phone,omitempty"`
	DateOfBirth           *string   `json:"dateOfBirth,omitempty"`
	EmergencyContactName  *string   `json:"emergencyContactName,omitempty"`
	EmergencyContactPhone *string   `json:"emergencyContactPhone,omitempty"`
	Notes                 *string   `json:"notes,omitempty"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}

type Lease struct {
	ID            int       `json:"id"`
	PropertyID    int       `json:"propertyId"`
	TenantID      int       `json:"tenantId"`
	StartDate     string    `json:"startDate"`
	EndDate       string    `json:"endDate"`
	MonthlyRent   float64   `json:"monthlyRent"`
	DepositAmount *float64  `json:"depositAmount,omitempty"`
	Status        string    `json:"status"`
	PaymentDueDay int       `json:"paymentDueDay"`
	Notes         *string   `json:"notes,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	// Joined fields for display
	PropertyName *string `json:"propertyName,omitempty"`
	TenantName   *string `json:"tenantName,omitempty"`
}

type DashboardStats struct {
	TotalProperties     int `json:"totalProperties"`
	AvailableProperties int `json:"availableProperties"`
	TotalTenants        int `json:"totalTenants"`
	ActiveLeases        int `json:"activeLeases"`
	UpcomingLeases      int `json:"upcomingLeases"`
}

type LoginRequest struct {
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// ============================================================================
// MAIN
// ============================================================================

func main() {
	// Load .env file before reading any config
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: no .env file found, relying on exported environment variables")
	}

	initAllowedOrigins()

	if err := connectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Connected to MySQL database")

	// Update lease statuses on startup
	updateLeaseStatuses()

	// Public routes
	http.HandleFunc("/api/health", healthHandler)
	http.HandleFunc("/api/properties", propertiesPublicHandler)
	http.HandleFunc("/api/properties/", propertyByIDPublicHandler)

	// Admin auth
	http.HandleFunc("/api/admin/login", adminLoginHandler)
	http.HandleFunc("/api/admin/logout", adminLogoutHandler)
	http.HandleFunc("/api/admin/me", adminMeHandler)

	// Admin dashboard
	http.HandleFunc("/api/admin/dashboard/stats", adminDashboardStatsHandler)

	// Admin properties
	http.HandleFunc("/api/admin/properties", adminPropertiesHandler)
	http.HandleFunc("/api/admin/properties/", adminPropertyByIDHandler)

	// Admin tenants
	http.HandleFunc("/api/admin/tenants", adminTenantsHandler)
	http.HandleFunc("/api/admin/tenants/", adminTenantByIDHandler)

	// Admin leases
	http.HandleFunc("/api/admin/leases", adminLeasesHandler)
	http.HandleFunc("/api/admin/leases/", adminLeaseByIDHandler)

	port := getEnv("PORT", "8080")
	fmt.Printf("Roses & Clovers Properties API starting on port %s...\n", port)
	fmt.Printf("Health check: http://localhost:%s/api/health\n", port)

	if err := http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)); err != nil {
		log.Fatal(err)
	}
}

// ============================================================================
// DATABASE
// ============================================================================

func connectDB() error {
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	user := mustGetEnv("DB_USER")
	password := mustGetEnv("DB_PASSWORD")
	name := mustGetEnv("DB_NAME")

	log.Printf("Connecting to MySQL as user=%s db=%s host=%s port=%s", user, name, host, port)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, name)

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db.Ping()
}

// mustGetEnv returns the value of an environment variable or fatally exits.
// No fallback — the variable must be set in .env or the process environment.
func mustGetEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("FATAL: required environment variable %s is not set. Check your .env file.", key)
	}
	return val
}

// getEnv returns the value of an environment variable with a fallback default.
// Use only for non-sensitive, optional config (e.g. PORT, ALLOWED_ORIGINS).
func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// ============================================================================
// HELPERS
// ============================================================================

func jsonError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

func jsonResponse(w http.ResponseWriter, data interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func generateToken() string {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func validateToken(r *http.Request) bool {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return false
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		return false
	}

	token := parts[1]

	tokenMutex.RLock()
	expiry, exists := tokenStore[token]
	tokenMutex.RUnlock()

	if !exists || time.Now().After(expiry) {
		if exists {
			tokenMutex.Lock()
			delete(tokenStore, token)
			tokenMutex.Unlock()
		}
		return false
	}

	return true
}

func requireAuth(w http.ResponseWriter, r *http.Request) bool {
	if !validateToken(r) {
		jsonError(w, "Unauthorized", http.StatusUnauthorized)
		return false
	}
	return true
}

func extractID(path, prefix string) (int, error) {
	idStr := strings.TrimPrefix(path, prefix)
	idStr = strings.TrimSuffix(idStr, "/")
	return strconv.Atoi(idStr)
}

// Update lease statuses based on current date
func updateLeaseStatuses() {
	today := time.Now().Format("2006-01-02")

	// Update to 'active' if start_date <= today and end_date >= today
	_, err := db.Exec(`
		UPDATE leases
		SET status = 'active'
		WHERE status = 'upcoming' AND start_date <= ? AND end_date >= ?
	`, today, today)
	if err != nil {
		log.Printf("Error updating active leases: %v", err)
	}

	// Update to 'ended' if end_date < today
	_, err = db.Exec(`
		UPDATE leases
		SET status = 'ended'
		WHERE status IN ('active', 'upcoming') AND end_date < ?
	`, today)
	if err != nil {
		log.Printf("Error updating ended leases: %v", err)
	}
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

var allowedOrigins []string

func initAllowedOrigins() {
	defaults := "http://localhost:3000,http://localhost:3001,http://34.227.145.219:3001,https://seanscoolprojectmmis6191.com"
	raw := getEnv("ALLOWED_ORIGINS", defaults)
	for _, o := range strings.Split(raw, ",") {
		if trimmed := strings.TrimSpace(o); trimmed != "" {
			allowedOrigins = append(allowedOrigins, trimmed)
		}
	}
}

func isOriginAllowed(origin string) bool {
	for _, o := range allowedOrigins {
		if o == origin {
			return true
		}
	}
	return false
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origin != "" && isOriginAllowed(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ============================================================================
// HANDLERS - HEALTH
// ============================================================================

func healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, map[string]interface{}{
		"status":    "healthy",
		"service":   "Roses & Clovers Properties API",
		"timestamp": time.Now(),
	}, http.StatusOK)
}

// ============================================================================
// HANDLERS - AUTH
// ============================================================================

func adminLoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	adminPassword := getEnv("ADMIN_PASSWORD", "admin123")
	if req.Password != adminPassword {
		jsonError(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	token := generateToken()
	tokenMutex.Lock()
	tokenStore[token] = time.Now().Add(24 * time.Hour)
	tokenMutex.Unlock()

	jsonResponse(w, LoginResponse{Token: token}, http.StatusOK)
}

func adminLogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && parts[0] == "Bearer" {
			token := parts[1]
			tokenMutex.Lock()
			delete(tokenStore, token)
			tokenMutex.Unlock()
		}
	}

	jsonResponse(w, map[string]string{"message": "Logged out"}, http.StatusOK)
}

func adminMeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if !requireAuth(w, r) {
		return
	}

	jsonResponse(w, map[string]interface{}{
		"authenticated": true,
		"role":          "admin",
	}, http.StatusOK)
}

// ============================================================================
// HANDLERS - DASHBOARD
// ============================================================================

func adminDashboardStatsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if !requireAuth(w, r) {
		return
	}

	var stats DashboardStats

	db.QueryRow("SELECT COUNT(*) FROM properties").Scan(&stats.TotalProperties)
	db.QueryRow("SELECT COUNT(*) FROM properties WHERE available = TRUE").Scan(&stats.AvailableProperties)
	db.QueryRow("SELECT COUNT(*) FROM tenants").Scan(&stats.TotalTenants)
	db.QueryRow("SELECT COUNT(*) FROM leases WHERE status = 'active'").Scan(&stats.ActiveLeases)
	db.QueryRow("SELECT COUNT(*) FROM leases WHERE status = 'upcoming'").Scan(&stats.UpcomingLeases)

	jsonResponse(w, stats, http.StatusOK)
}

// ============================================================================
// HANDLERS - PUBLIC PROPERTIES
// ============================================================================

func propertiesPublicHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := `
		SELECT id, name, address_line1, address_line2, city, state, zip,
			   property_type, bedrooms, bathrooms, square_feet, monthly_rent,
			   deposit_amount, available, available_date, description, amenities, image_url,
			   created_at, updated_at
		FROM properties WHERE 1=1
	`
	args := []interface{}{}

	// Filter by availability
	if available := r.URL.Query().Get("available"); available != "" {
		if available == "true" {
			query += " AND available = TRUE"
		} else if available == "false" {
			query += " AND available = FALSE"
		}
	}

	// Filter by bedrooms
	if beds := r.URL.Query().Get("beds"); beds != "" {
		if bedsInt, err := strconv.Atoi(beds); err == nil {
			query += " AND bedrooms >= ?"
			args = append(args, bedsInt)
		}
	}

	// Filter by min rent
	if minRent := r.URL.Query().Get("minRent"); minRent != "" {
		if minRentFloat, err := strconv.ParseFloat(minRent, 64); err == nil {
			query += " AND monthly_rent >= ?"
			args = append(args, minRentFloat)
		}
	}

	// Filter by max rent
	if maxRent := r.URL.Query().Get("maxRent"); maxRent != "" {
		if maxRentFloat, err := strconv.ParseFloat(maxRent, 64); err == nil {
			query += " AND monthly_rent <= ?"
			args = append(args, maxRentFloat)
		}
	}

	// Search by name or address
	if search := r.URL.Query().Get("search"); search != "" {
		query += " AND (name LIKE ? OR address_line1 LIKE ? OR city LIKE ?)"
		searchPattern := "%" + search + "%"
		args = append(args, searchPattern, searchPattern, searchPattern)
	}

	// Filter by property type
	if propType := r.URL.Query().Get("type"); propType != "" {
		query += " AND property_type = ?"
		args = append(args, propType)
	}

	query += " ORDER BY available DESC, monthly_rent ASC"

	rows, err := db.Query(query, args...)
	if err != nil {
		log.Printf("Error querying properties: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	properties := []Property{}
	for rows.Next() {
		p, err := scanProperty(rows)
		if err != nil {
			log.Printf("Error scanning property: %v", err)
			continue
		}
		properties = append(properties, p)
	}

	jsonResponse(w, properties, http.StatusOK)
}

func propertyByIDPublicHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id, err := extractID(r.URL.Path, "/api/properties/")
	if err != nil {
		jsonError(w, "Invalid property ID", http.StatusBadRequest)
		return
	}

	row := db.QueryRow(`
		SELECT id, name, address_line1, address_line2, city, state, zip,
			   property_type, bedrooms, bathrooms, square_feet, monthly_rent,
			   deposit_amount, available, available_date, description, amenities, image_url,
			   created_at, updated_at
		FROM properties WHERE id = ?
	`, id)

	p, err := scanPropertyRow(row)
	if err == sql.ErrNoRows {
		jsonError(w, "Property not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error getting property: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, p, http.StatusOK)
}

// ============================================================================
// HANDLERS - ADMIN PROPERTIES
// ============================================================================

func adminPropertiesHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		getPropertiesAdmin(w, r)
	case http.MethodPost:
		createProperty(w, r)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func adminPropertyByIDHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	id, err := extractID(r.URL.Path, "/api/admin/properties/")
	if err != nil {
		jsonError(w, "Invalid property ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getPropertyByID(w, id)
	case http.MethodPut:
		updateProperty(w, r, id)
	case http.MethodDelete:
		deleteProperty(w, id)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getPropertiesAdmin(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, name, address_line1, address_line2, city, state, zip,
			   property_type, bedrooms, bathrooms, square_feet, monthly_rent,
			   deposit_amount, available, available_date, description, amenities, image_url,
			   created_at, updated_at
		FROM properties ORDER BY created_at DESC
	`)
	if err != nil {
		log.Printf("Error querying properties: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	properties := []Property{}
	for rows.Next() {
		p, err := scanProperty(rows)
		if err != nil {
			log.Printf("Error scanning property: %v", err)
			continue
		}
		properties = append(properties, p)
	}

	jsonResponse(w, properties, http.StatusOK)
}

func getPropertyByID(w http.ResponseWriter, id int) {
	row := db.QueryRow(`
		SELECT id, name, address_line1, address_line2, city, state, zip,
			   property_type, bedrooms, bathrooms, square_feet, monthly_rent,
			   deposit_amount, available, available_date, description, amenities, image_url,
			   created_at, updated_at
		FROM properties WHERE id = ?
	`, id)

	p, err := scanPropertyRow(row)
	if err == sql.ErrNoRows {
		jsonError(w, "Property not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error getting property: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, p, http.StatusOK)
}

func createProperty(w http.ResponseWriter, r *http.Request) {
	var p Property
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if p.Name == "" || p.AddressLine1 == "" || p.City == "" || p.State == "" || p.Zip == "" {
		jsonError(w, "Name, address, city, state, and zip are required", http.StatusBadRequest)
		return
	}

	amenitiesJSON, _ := json.Marshal(p.Amenities)

	result, err := db.Exec(`
		INSERT INTO properties (name, address_line1, address_line2, city, state, zip,
			property_type, bedrooms, bathrooms, square_feet, monthly_rent,
			deposit_amount, available, available_date, description, amenities, image_url)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, p.Name, p.AddressLine1, p.AddressLine2, p.City, p.State, p.Zip,
		p.PropertyType, p.Bedrooms, p.Bathrooms, p.SquareFeet, p.MonthlyRent,
		p.DepositAmount, p.Available, p.AvailableDate, p.Description, string(amenitiesJSON), p.ImageURL)

	if err != nil {
		log.Printf("Error creating property: %v", err)
		jsonError(w, "Failed to create property", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	p.ID = int(id)
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()

	jsonResponse(w, p, http.StatusCreated)
}

func updateProperty(w http.ResponseWriter, r *http.Request, id int) {
	var p Property
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	amenitiesJSON, _ := json.Marshal(p.Amenities)

	result, err := db.Exec(`
		UPDATE properties SET name=?, address_line1=?, address_line2=?, city=?, state=?, zip=?,
			property_type=?, bedrooms=?, bathrooms=?, square_feet=?, monthly_rent=?,
			deposit_amount=?, available=?, available_date=?, description=?, amenities=?, image_url=?
		WHERE id=?
	`, p.Name, p.AddressLine1, p.AddressLine2, p.City, p.State, p.Zip,
		p.PropertyType, p.Bedrooms, p.Bathrooms, p.SquareFeet, p.MonthlyRent,
		p.DepositAmount, p.Available, p.AvailableDate, p.Description, string(amenitiesJSON), p.ImageURL, id)

	if err != nil {
		log.Printf("Error updating property: %v", err)
		jsonError(w, "Failed to update property", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Property not found", http.StatusNotFound)
		return
	}

	p.ID = id
	jsonResponse(w, p, http.StatusOK)
}

func deleteProperty(w http.ResponseWriter, id int) {
	// Check for active/upcoming leases
	var leaseCount int
	db.QueryRow("SELECT COUNT(*) FROM leases WHERE property_id = ? AND status IN ('active', 'upcoming')", id).Scan(&leaseCount)
	if leaseCount > 0 {
		jsonError(w, "Cannot delete property with active or upcoming leases", http.StatusConflict)
		return
	}

	result, err := db.Exec("DELETE FROM properties WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting property: %v", err)
		jsonError(w, "Failed to delete property", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Property not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ============================================================================
// HANDLERS - ADMIN TENANTS
// ============================================================================

func adminTenantsHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		getTenants(w)
	case http.MethodPost:
		createTenant(w, r)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func adminTenantByIDHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	id, err := extractID(r.URL.Path, "/api/admin/tenants/")
	if err != nil {
		jsonError(w, "Invalid tenant ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getTenantByID(w, id)
	case http.MethodPut:
		updateTenant(w, r, id)
	case http.MethodDelete:
		deleteTenant(w, id)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getTenants(w http.ResponseWriter) {
	rows, err := db.Query(`
		SELECT id, first_name, last_name, email, phone, date_of_birth,
			   emergency_contact_name, emergency_contact_phone, notes, created_at, updated_at
		FROM tenants ORDER BY last_name, first_name
	`)
	if err != nil {
		log.Printf("Error querying tenants: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tenants := []Tenant{}
	for rows.Next() {
		t, err := scanTenant(rows)
		if err != nil {
			log.Printf("Error scanning tenant: %v", err)
			continue
		}
		tenants = append(tenants, t)
	}

	jsonResponse(w, tenants, http.StatusOK)
}

func getTenantByID(w http.ResponseWriter, id int) {
	row := db.QueryRow(`
		SELECT id, first_name, last_name, email, phone, date_of_birth,
			   emergency_contact_name, emergency_contact_phone, notes, created_at, updated_at
		FROM tenants WHERE id = ?
	`, id)

	t, err := scanTenantRow(row)
	if err == sql.ErrNoRows {
		jsonError(w, "Tenant not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error getting tenant: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, t, http.StatusOK)
}

func createTenant(w http.ResponseWriter, r *http.Request) {
	var t Tenant
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if t.FirstName == "" || t.LastName == "" || t.Email == "" {
		jsonError(w, "First name, last name, and email are required", http.StatusBadRequest)
		return
	}

	result, err := db.Exec(`
		INSERT INTO tenants (first_name, last_name, email, phone, date_of_birth,
			emergency_contact_name, emergency_contact_phone, notes)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, t.FirstName, t.LastName, t.Email, t.Phone, t.DateOfBirth,
		t.EmergencyContactName, t.EmergencyContactPhone, t.Notes)

	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			jsonError(w, "A tenant with this email already exists", http.StatusConflict)
			return
		}
		log.Printf("Error creating tenant: %v", err)
		jsonError(w, "Failed to create tenant", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	t.ID = int(id)
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()

	jsonResponse(w, t, http.StatusCreated)
}

func updateTenant(w http.ResponseWriter, r *http.Request, id int) {
	var t Tenant
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	result, err := db.Exec(`
		UPDATE tenants SET first_name=?, last_name=?, email=?, phone=?, date_of_birth=?,
			emergency_contact_name=?, emergency_contact_phone=?, notes=?
		WHERE id=?
	`, t.FirstName, t.LastName, t.Email, t.Phone, t.DateOfBirth,
		t.EmergencyContactName, t.EmergencyContactPhone, t.Notes, id)

	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			jsonError(w, "A tenant with this email already exists", http.StatusConflict)
			return
		}
		log.Printf("Error updating tenant: %v", err)
		jsonError(w, "Failed to update tenant", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Tenant not found", http.StatusNotFound)
		return
	}

	t.ID = id
	jsonResponse(w, t, http.StatusOK)
}

func deleteTenant(w http.ResponseWriter, id int) {
	// Check for active/upcoming leases
	var leaseCount int
	db.QueryRow("SELECT COUNT(*) FROM leases WHERE tenant_id = ? AND status IN ('active', 'upcoming')", id).Scan(&leaseCount)
	if leaseCount > 0 {
		jsonError(w, "Cannot delete tenant with active or upcoming leases", http.StatusConflict)
		return
	}

	result, err := db.Exec("DELETE FROM tenants WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting tenant: %v", err)
		jsonError(w, "Failed to delete tenant", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Tenant not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ============================================================================
// HANDLERS - ADMIN LEASES
// ============================================================================

func adminLeasesHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		getLeases(w, r)
	case http.MethodPost:
		createLease(w, r)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func adminLeaseByIDHandler(w http.ResponseWriter, r *http.Request) {
	if !requireAuth(w, r) {
		return
	}

	id, err := extractID(r.URL.Path, "/api/admin/leases/")
	if err != nil {
		jsonError(w, "Invalid lease ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getLeaseByID(w, id)
	case http.MethodPut:
		updateLease(w, r, id)
	case http.MethodDelete:
		deleteLease(w, id)
	default:
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getLeases(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT l.id, l.property_id, l.tenant_id, l.start_date, l.end_date,
			   l.monthly_rent, l.deposit_amount, l.status, l.payment_due_day,
			   l.notes, l.created_at, l.updated_at,
			   p.name as property_name,
			   CONCAT(t.first_name, ' ', t.last_name) as tenant_name
		FROM leases l
		JOIN properties p ON l.property_id = p.id
		JOIN tenants t ON l.tenant_id = t.id
		WHERE 1=1
	`
	args := []interface{}{}

	if status := r.URL.Query().Get("status"); status != "" {
		query += " AND l.status = ?"
		args = append(args, status)
	}

	if propertyID := r.URL.Query().Get("propertyId"); propertyID != "" {
		if id, err := strconv.Atoi(propertyID); err == nil {
			query += " AND l.property_id = ?"
			args = append(args, id)
		}
	}

	if tenantID := r.URL.Query().Get("tenantId"); tenantID != "" {
		if id, err := strconv.Atoi(tenantID); err == nil {
			query += " AND l.tenant_id = ?"
			args = append(args, id)
		}
	}

	query += " ORDER BY l.start_date DESC"

	rows, err := db.Query(query, args...)
	if err != nil {
		log.Printf("Error querying leases: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	leases := []Lease{}
	for rows.Next() {
		l, err := scanLeaseWithJoins(rows)
		if err != nil {
			log.Printf("Error scanning lease: %v", err)
			continue
		}
		leases = append(leases, l)
	}

	jsonResponse(w, leases, http.StatusOK)
}

func getLeaseByID(w http.ResponseWriter, id int) {
	row := db.QueryRow(`
		SELECT l.id, l.property_id, l.tenant_id, l.start_date, l.end_date,
			   l.monthly_rent, l.deposit_amount, l.status, l.payment_due_day,
			   l.notes, l.created_at, l.updated_at,
			   p.name as property_name,
			   CONCAT(t.first_name, ' ', t.last_name) as tenant_name
		FROM leases l
		JOIN properties p ON l.property_id = p.id
		JOIN tenants t ON l.tenant_id = t.id
		WHERE l.id = ?
	`, id)

	l, err := scanLeaseWithJoinsRow(row)
	if err == sql.ErrNoRows {
		jsonError(w, "Lease not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error getting lease: %v", err)
		jsonError(w, "Database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, l, http.StatusOK)
}

func createLease(w http.ResponseWriter, r *http.Request) {
	var l Lease
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if l.PropertyID == 0 || l.TenantID == 0 || l.StartDate == "" || l.EndDate == "" {
		jsonError(w, "Property, tenant, start date, and end date are required", http.StatusBadRequest)
		return
	}

	// Validate dates
	startDate, err1 := time.Parse("2006-01-02", l.StartDate)
	endDate, err2 := time.Parse("2006-01-02", l.EndDate)
	if err1 != nil || err2 != nil {
		jsonError(w, "Invalid date format (use YYYY-MM-DD)", http.StatusBadRequest)
		return
	}
	if !endDate.After(startDate) {
		jsonError(w, "End date must be after start date", http.StatusBadRequest)
		return
	}

	// Check property exists
	var propertyExists int
	db.QueryRow("SELECT COUNT(*) FROM properties WHERE id = ?", l.PropertyID).Scan(&propertyExists)
	if propertyExists == 0 {
		jsonError(w, "Property not found", http.StatusBadRequest)
		return
	}

	// Check tenant exists
	var tenantExists int
	db.QueryRow("SELECT COUNT(*) FROM tenants WHERE id = ?", l.TenantID).Scan(&tenantExists)
	if tenantExists == 0 {
		jsonError(w, "Tenant not found", http.StatusBadRequest)
		return
	}

	// Check for overlapping leases on the same property
	var overlap int
	db.QueryRow(`
		SELECT COUNT(*) FROM leases
		WHERE property_id = ?
		AND status IN ('active', 'upcoming')
		AND NOT (end_date < ? OR start_date > ?)
	`, l.PropertyID, l.StartDate, l.EndDate).Scan(&overlap)
	if overlap > 0 {
		jsonError(w, "This property already has an active or upcoming lease during this period", http.StatusConflict)
		return
	}

	// Determine status based on dates
	today := time.Now().Format("2006-01-02")
	if l.StartDate > today {
		l.Status = "upcoming"
	} else if l.EndDate < today {
		l.Status = "ended"
	} else {
		l.Status = "active"
	}

	if l.PaymentDueDay == 0 {
		l.PaymentDueDay = 1
	}

	result, err := db.Exec(`
		INSERT INTO leases (property_id, tenant_id, start_date, end_date, monthly_rent,
			deposit_amount, status, payment_due_day, notes)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, l.PropertyID, l.TenantID, l.StartDate, l.EndDate, l.MonthlyRent,
		l.DepositAmount, l.Status, l.PaymentDueDay, l.Notes)

	if err != nil {
		log.Printf("Error creating lease: %v", err)
		jsonError(w, "Failed to create lease", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	l.ID = int(id)
	l.CreatedAt = time.Now()
	l.UpdatedAt = time.Now()

	// Update property availability
	if l.Status == "active" {
		db.Exec("UPDATE properties SET available = FALSE WHERE id = ?", l.PropertyID)
	}

	jsonResponse(w, l, http.StatusCreated)
}

func updateLease(w http.ResponseWriter, r *http.Request, id int) {
	var l Lease
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate dates
	if l.StartDate != "" && l.EndDate != "" {
		startDate, err1 := time.Parse("2006-01-02", l.StartDate)
		endDate, err2 := time.Parse("2006-01-02", l.EndDate)
		if err1 != nil || err2 != nil {
			jsonError(w, "Invalid date format (use YYYY-MM-DD)", http.StatusBadRequest)
			return
		}
		if !endDate.After(startDate) {
			jsonError(w, "End date must be after start date", http.StatusBadRequest)
			return
		}
	}

	// Check for overlapping leases (excluding current)
	if l.PropertyID != 0 && l.StartDate != "" && l.EndDate != "" {
		var overlap int
		db.QueryRow(`
			SELECT COUNT(*) FROM leases
			WHERE property_id = ?
			AND id != ?
			AND status IN ('active', 'upcoming')
			AND NOT (end_date < ? OR start_date > ?)
		`, l.PropertyID, id, l.StartDate, l.EndDate).Scan(&overlap)
		if overlap > 0 {
			jsonError(w, "This property already has an active or upcoming lease during this period", http.StatusConflict)
			return
		}
	}

	result, err := db.Exec(`
		UPDATE leases SET property_id=?, tenant_id=?, start_date=?, end_date=?,
			monthly_rent=?, deposit_amount=?, status=?, payment_due_day=?, notes=?
		WHERE id=?
	`, l.PropertyID, l.TenantID, l.StartDate, l.EndDate, l.MonthlyRent,
		l.DepositAmount, l.Status, l.PaymentDueDay, l.Notes, id)

	if err != nil {
		log.Printf("Error updating lease: %v", err)
		jsonError(w, "Failed to update lease", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Lease not found", http.StatusNotFound)
		return
	}

	l.ID = id
	jsonResponse(w, l, http.StatusOK)
}

func deleteLease(w http.ResponseWriter, id int) {
	// Get lease info before deleting
	var propertyID int
	var status string
	db.QueryRow("SELECT property_id, status FROM leases WHERE id = ?", id).Scan(&propertyID, &status)

	result, err := db.Exec("DELETE FROM leases WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting lease: %v", err)
		jsonError(w, "Failed to delete lease", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		jsonError(w, "Lease not found", http.StatusNotFound)
		return
	}

	// Update property availability if lease was active
	if status == "active" {
		db.Exec("UPDATE properties SET available = TRUE WHERE id = ?", propertyID)
	}

	w.WriteHeader(http.StatusNoContent)
}

// ============================================================================
// SCAN HELPERS
// ============================================================================

func scanProperty(rows *sql.Rows) (Property, error) {
	var p Property
	var addressLine2, description, availableDate, imageURL sql.NullString
	var squareFeet sql.NullInt64
	var depositAmount sql.NullFloat64
	var amenitiesJSON sql.NullString

	err := rows.Scan(&p.ID, &p.Name, &p.AddressLine1, &addressLine2, &p.City, &p.State, &p.Zip,
		&p.PropertyType, &p.Bedrooms, &p.Bathrooms, &squareFeet, &p.MonthlyRent,
		&depositAmount, &p.Available, &availableDate, &description, &amenitiesJSON, &imageURL,
		&p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return p, err
	}

	if addressLine2.Valid {
		p.AddressLine2 = &addressLine2.String
	}
	if description.Valid {
		p.Description = &description.String
	}
	if availableDate.Valid {
		p.AvailableDate = &availableDate.String
	}
	if imageURL.Valid {
		p.ImageURL = &imageURL.String
	}
	if squareFeet.Valid {
		sqft := int(squareFeet.Int64)
		p.SquareFeet = &sqft
	}
	if depositAmount.Valid {
		p.DepositAmount = &depositAmount.Float64
	}
	if amenitiesJSON.Valid && amenitiesJSON.String != "" {
		json.Unmarshal([]byte(amenitiesJSON.String), &p.Amenities)
	}

	return p, nil
}

func scanPropertyRow(row *sql.Row) (Property, error) {
	var p Property
	var addressLine2, description, availableDate, imageURL sql.NullString
	var squareFeet sql.NullInt64
	var depositAmount sql.NullFloat64
	var amenitiesJSON sql.NullString

	err := row.Scan(&p.ID, &p.Name, &p.AddressLine1, &addressLine2, &p.City, &p.State, &p.Zip,
		&p.PropertyType, &p.Bedrooms, &p.Bathrooms, &squareFeet, &p.MonthlyRent,
		&depositAmount, &p.Available, &availableDate, &description, &amenitiesJSON, &imageURL,
		&p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return p, err
	}

	if addressLine2.Valid {
		p.AddressLine2 = &addressLine2.String
	}
	if description.Valid {
		p.Description = &description.String
	}
	if availableDate.Valid {
		p.AvailableDate = &availableDate.String
	}
	if imageURL.Valid {
		p.ImageURL = &imageURL.String
	}
	if squareFeet.Valid {
		sqft := int(squareFeet.Int64)
		p.SquareFeet = &sqft
	}
	if depositAmount.Valid {
		p.DepositAmount = &depositAmount.Float64
	}
	if amenitiesJSON.Valid && amenitiesJSON.String != "" {
		json.Unmarshal([]byte(amenitiesJSON.String), &p.Amenities)
	}

	return p, nil
}

func scanTenant(rows *sql.Rows) (Tenant, error) {
	var t Tenant
	var phone, dob, ecName, ecPhone, notes sql.NullString

	err := rows.Scan(&t.ID, &t.FirstName, &t.LastName, &t.Email, &phone, &dob,
		&ecName, &ecPhone, &notes, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		return t, err
	}

	if phone.Valid {
		t.Phone = &phone.String
	}
	if dob.Valid {
		t.DateOfBirth = &dob.String
	}
	if ecName.Valid {
		t.EmergencyContactName = &ecName.String
	}
	if ecPhone.Valid {
		t.EmergencyContactPhone = &ecPhone.String
	}
	if notes.Valid {
		t.Notes = &notes.String
	}

	return t, nil
}

func scanTenantRow(row *sql.Row) (Tenant, error) {
	var t Tenant
	var phone, dob, ecName, ecPhone, notes sql.NullString

	err := row.Scan(&t.ID, &t.FirstName, &t.LastName, &t.Email, &phone, &dob,
		&ecName, &ecPhone, &notes, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		return t, err
	}

	if phone.Valid {
		t.Phone = &phone.String
	}
	if dob.Valid {
		t.DateOfBirth = &dob.String
	}
	if ecName.Valid {
		t.EmergencyContactName = &ecName.String
	}
	if ecPhone.Valid {
		t.EmergencyContactPhone = &ecPhone.String
	}
	if notes.Valid {
		t.Notes = &notes.String
	}

	return t, nil
}

func scanLeaseWithJoins(rows *sql.Rows) (Lease, error) {
	var l Lease
	var depositAmount sql.NullFloat64
	var notes, propertyName, tenantName sql.NullString

	err := rows.Scan(&l.ID, &l.PropertyID, &l.TenantID, &l.StartDate, &l.EndDate,
		&l.MonthlyRent, &depositAmount, &l.Status, &l.PaymentDueDay,
		&notes, &l.CreatedAt, &l.UpdatedAt, &propertyName, &tenantName)
	if err != nil {
		return l, err
	}

	if depositAmount.Valid {
		l.DepositAmount = &depositAmount.Float64
	}
	if notes.Valid {
		l.Notes = &notes.String
	}
	if propertyName.Valid {
		l.PropertyName = &propertyName.String
	}
	if tenantName.Valid {
		l.TenantName = &tenantName.String
	}

	return l, nil
}

func scanLeaseWithJoinsRow(row *sql.Row) (Lease, error) {
	var l Lease
	var depositAmount sql.NullFloat64
	var notes, propertyName, tenantName sql.NullString

	err := row.Scan(&l.ID, &l.PropertyID, &l.TenantID, &l.StartDate, &l.EndDate,
		&l.MonthlyRent, &depositAmount, &l.Status, &l.PaymentDueDay,
		&notes, &l.CreatedAt, &l.UpdatedAt, &propertyName, &tenantName)
	if err != nil {
		return l, err
	}

	if depositAmount.Valid {
		l.DepositAmount = &depositAmount.Float64
	}
	if notes.Valid {
		l.Notes = &notes.String
	}
	if propertyName.Valid {
		l.PropertyName = &propertyName.String
	}
	if tenantName.Valid {
		l.TenantName = &tenantName.String
	}

	return l, nil
}
