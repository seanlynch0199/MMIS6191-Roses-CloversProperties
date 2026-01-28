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
)

var db *sql.DB

// Simple in-memory token store (in production, use Redis or database)
var (
	tokenStore = make(map[string]time.Time)
	tokenMutex sync.RWMutex
)

// --- Response types ---

type HealthResponse struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type Athlete struct {
	ID                    int       `json:"id"`
	Name                  string    `json:"name"`
	Grade                 int       `json:"grade"`
	PersonalRecordSeconds int       `json:"personal_record_seconds"`
	CreatedAt             time.Time `json:"created_at"`
}

// AthleteAdmin is used for admin CRUD with firstName/lastName support
type AthleteAdmin struct {
	ID        string   `json:"id"`
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Grade     *int     `json:"grade,omitempty"`
	Events    []string `json:"events,omitempty"`
	Team      *string  `json:"team,omitempty"`
	CreatedAt string   `json:"createdAt,omitempty"`
	UpdatedAt string   `json:"updatedAt,omitempty"`
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

type Meet struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	MeetDate  string    `json:"meet_date"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"created_at"`
}

type Result struct {
	ID           int       `json:"id"`
	AthleteID    int       `json:"athlete_id"`
	MeetID       int       `json:"meet_id"`
	TimeSeconds  int       `json:"time_seconds"`
	PlaceOverall int       `json:"place_overall"`
	CreatedAt    time.Time `json:"created_at"`
}

// --- Main ---

func main() {
	// Connect to MySQL
	if err := connectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Connected to MySQL database")

	// API routes
	http.HandleFunc("/api/health", healthHandler)
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/athletes", athletesHandler)
	http.HandleFunc("/api/athletes/", athleteByIDHandler)
	http.HandleFunc("/api/meets", meetsHandler)
	http.HandleFunc("/api/results", resultsHandler)
	http.HandleFunc("/api/admin/login", adminLoginHandler)

	port := getEnv("PORT", "8080")
	fmt.Printf("Server starting on port %s...\n", port)
	fmt.Printf("Health check: http://localhost:%s/api/health\n", port)

	if err := http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)); err != nil {
		log.Fatal(err)
	}
}

// --- Database ---

func connectDB() error {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "3306")
	user := getEnv("DB_USER", "root")
	password := getEnv("DB_PASSWORD", "")
	name := getEnv("DB_NAME", "jones_county_xc")

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

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// --- Handlers ---

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HealthResponse{
		Message:   "Server is running",
		Timestamp: time.Now(),
	})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HealthResponse{
		Message:   "Hello from Jones County XC backend!",
		Timestamp: time.Now(),
	})
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getAthletes(w, r)
	case http.MethodPost:
		if !validateToken(r) {
			jsonError(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		createAthlete(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getAthletes(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, grade, personal_record_seconds, created_at FROM athletes ORDER BY created_at DESC")
	if err != nil {
		log.Printf("Error querying athletes: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	athletes := []AthleteAdmin{}
	for rows.Next() {
		var id int
		var name string
		var grade int
		var prSeconds int
		var createdAt time.Time
		if err := rows.Scan(&id, &name, &grade, &prSeconds, &createdAt); err != nil {
			log.Printf("Error scanning athlete row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		// Split name into first/last
		parts := strings.SplitN(name, " ", 2)
		firstName := parts[0]
		lastName := ""
		if len(parts) > 1 {
			lastName = parts[1]
		}
		athletes = append(athletes, AthleteAdmin{
			ID:        strconv.Itoa(id),
			FirstName: firstName,
			LastName:  lastName,
			Grade:     &grade,
			CreatedAt: createdAt.Format(time.RFC3339),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athletes)
}

func createAthlete(w http.ResponseWriter, r *http.Request) {
	var input AthleteAdmin
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if input.FirstName == "" || input.LastName == "" {
		jsonError(w, "firstName and lastName are required", http.StatusBadRequest)
		return
	}

	fullName := input.FirstName + " " + input.LastName
	grade := 0
	if input.Grade != nil {
		grade = *input.Grade
	}

	result, err := db.Exec("INSERT INTO athletes (name, grade, personal_record_seconds) VALUES (?, ?, 0)", fullName, grade)
	if err != nil {
		log.Printf("Error creating athlete: %v", err)
		jsonError(w, "Failed to create athlete", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	output := AthleteAdmin{
		ID:        strconv.FormatInt(id, 10),
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Grade:     input.Grade,
		Events:    input.Events,
		Team:      input.Team,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(output)
}

func athleteByIDHandler(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL path: /api/athletes/{id}
	path := strings.TrimPrefix(r.URL.Path, "/api/athletes/")
	id := strings.TrimSuffix(path, "/")
	if id == "" {
		jsonError(w, "Athlete ID required", http.StatusBadRequest)
		return
	}

	if !validateToken(r) {
		jsonError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodPut:
		updateAthlete(w, r, id)
	case http.MethodDelete:
		deleteAthlete(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func updateAthlete(w http.ResponseWriter, r *http.Request, id string) {
	var input AthleteAdmin
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if input.FirstName == "" || input.LastName == "" {
		jsonError(w, "firstName and lastName are required", http.StatusBadRequest)
		return
	}

	fullName := input.FirstName + " " + input.LastName
	grade := 0
	if input.Grade != nil {
		grade = *input.Grade
	}

	result, err := db.Exec("UPDATE athletes SET name = ?, grade = ? WHERE id = ?", fullName, grade, id)
	if err != nil {
		log.Printf("Error updating athlete: %v", err)
		jsonError(w, "Failed to update athlete", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		jsonError(w, "Athlete not found", http.StatusNotFound)
		return
	}

	output := AthleteAdmin{
		ID:        id,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Grade:     input.Grade,
		Events:    input.Events,
		Team:      input.Team,
		UpdatedAt: time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(output)
}

func deleteAthlete(w http.ResponseWriter, r *http.Request, id string) {
	result, err := db.Exec("DELETE FROM athletes WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting athlete: %v", err)
		jsonError(w, "Failed to delete athlete", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		jsonError(w, "Athlete not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, meet_date, location, created_at FROM meets ORDER BY meet_date ASC")
	if err != nil {
		log.Printf("Error querying meets: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	meets := []Meet{}
	for rows.Next() {
		var m Meet
		var meetDate time.Time
		if err := rows.Scan(&m.ID, &m.Name, &meetDate, &m.Location, &m.CreatedAt); err != nil {
			log.Printf("Error scanning meet row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		m.MeetDate = meetDate.Format("2006-01-02")
		meets = append(meets, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meets)
}

func resultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, athlete_id, meet_id, time_seconds, place_overall, created_at FROM results ORDER BY created_at DESC")
	if err != nil {
		log.Printf("Error querying results: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	results := []Result{}
	for rows.Next() {
		var res Result
		if err := rows.Scan(&res.ID, &res.AthleteID, &res.MeetID, &res.TimeSeconds, &res.PlaceOverall, &res.CreatedAt); err != nil {
			log.Printf("Error scanning result row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// --- Admin Auth ---

func adminLoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Get admin password from environment variable
	adminPassword := getEnv("ADMIN_PASSWORD", "admin123")

	if req.Password != adminPassword {
		jsonError(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Generate token
	token := generateToken()

	// Store token with expiration (24 hours)
	tokenMutex.Lock()
	tokenStore[token] = time.Now().Add(24 * time.Hour)
	tokenMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{Token: token})
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
			// Clean up expired token
			tokenMutex.Lock()
			delete(tokenStore, token)
			tokenMutex.Unlock()
		}
		return false
	}

	return true
}

func jsonError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

// --- Middleware ---

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
