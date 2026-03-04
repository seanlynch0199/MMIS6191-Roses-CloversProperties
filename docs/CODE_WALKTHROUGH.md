# Code Walkthrough

Three pieces of code that show how the full stack fits together.

---

## 1. Frontend Component — Properties Listing Page

**File:** `frontend/app/properties/page.tsx`

```tsx
export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({
    available: true,
  })
  const [search, setSearch] = useState('')

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  })

  const handleFilterChange = (key: keyof PropertyFilters, value: ...) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  ...
}
```

**What this shows:**

- **Two pieces of state:** `filters` holds the active query (type, beds, availability, search text). `search` holds the text input while the user is typing — it only gets merged into `filters` when they press Enter or click Search. This prevents a new API call on every keystroke.
- **React Query (`useQuery`):** The `queryKey` includes `filters`, so any time a filter changes React Query automatically re-fetches. No manual `useEffect` needed to trigger the API call.
- **`fetchProperties(filters)`** in `lib/api.ts` converts the filter object into URL query params (e.g. `?available=true&beds=2&type=apartment`) and sends them to the backend.
- **Conditional rendering:** The JSX shows a skeleton grid while loading, the property cards when data arrives, and an empty state with a "Clear all filters" prompt if nothing matches.

The data path: user changes a dropdown → `handleFilterChange` updates `filters` state → React Query sees the new `queryKey` → calls the API → renders the updated cards.

---

## 2. Backend API Endpoint — Public Properties Handler

**File:** `backend/main.go`, line 461

```go
func propertiesPublicHandler(w http.ResponseWriter, r *http.Request) {
    query := `SELECT id, name, address_line1, ... FROM properties WHERE 1=1`
    args := []interface{}{}

    if available := r.URL.Query().Get("available"); available != "" {
        if available == "true" {
            query += " AND available = TRUE"
        }
    }

    if beds := r.URL.Query().Get("beds"); beds != "" {
        if bedsInt, err := strconv.Atoi(beds); err == nil {
            query += " AND bedrooms >= ?"
            args = append(args, bedsInt)
        }
    }

    if search := r.URL.Query().Get("search"); search != "" {
        query += " AND (name LIKE ? OR address_line1 LIKE ? OR city LIKE ?)"
        searchPattern := "%" + search + "%"
        args = append(args, searchPattern, searchPattern, searchPattern)
    }

    query += " ORDER BY available DESC, monthly_rent ASC"

    rows, err := db.Query(query, args...)
    ...
    for rows.Next() {
        p, err := scanProperty(rows)
        properties = append(properties, p)
    }

    jsonResponse(w, properties, http.StatusOK)
}
```

**What this shows:**

- **Dynamic query building:** The base query is `WHERE 1=1` (always true), so any number of `AND` clauses can be appended without needing to track whether a `WHERE` keyword has been written yet.
- **Parameterized queries:** Filters use `?` placeholders and a matching `args` slice. The values are never interpolated directly into the query string, which prevents SQL injection.
- **Type validation before use:** The bedrooms value is parsed with `strconv.Atoi` and only appended if parsing succeeds — bad input is silently ignored rather than causing an error.
- **Search uses LIKE:** The search term is wrapped in `%` wildcards and matched against name, address, and city so a single search box covers multiple columns.
- **Ordering:** Results come back available-first, then sorted by lowest rent — this is a product decision baked into the query so the frontend doesn't have to sort.

---

## 3. Database Query — Leases with Joined Names

**File:** `backend/main.go`, line 995

```go
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
    ...
    if status := r.URL.Query().Get("status"); status != "" {
        query += " AND l.status = ?"
        args = append(args, status)
    }
    ...
    query += " ORDER BY l.start_date DESC"
```

**What this shows:**

- **JOIN across three tables:** The leases table stores only `property_id` and `tenant_id` (foreign keys), not names. The query JOINs both tables so the response includes human-readable names without a second round trip from the frontend.
- **`CONCAT` in SQL:** The tenant's full name is assembled in the database (`CONCAT(first_name, ' ', last_name)`) rather than in Go, keeping the transformation close to the data source.
- **Same dynamic filter pattern as the public endpoint:** The `WHERE 1=1` base with optional `AND` clauses, using the same parameterized `?` approach. This consistency means the pattern is predictable across all handlers.
- **Why this matters for data flow:** The admin leases page shows property name and tenant name in the table. Those fields don't live in the leases table — they come from the JOIN. The `Lease` struct in Go has `PropertyName *string` and `TenantName *string` as pointer fields (nullable) specifically to hold these joined values. If the JOIN ever fails to find a match, the pointers are nil and the frontend falls back to displaying the raw IDs.

---

## How the Three Pieces Connect

```
User applies a filter
        ↓
PropertiesPage (React) updates `filters` state
        ↓
React Query calls fetchProperties(filters) in lib/api.ts
        ↓
api.ts builds /api/properties?available=true&beds=2 and fetches it
        ↓
propertiesPublicHandler (Go) reads query params, builds SQL, runs query
        ↓
MySQL returns rows → scanProperty maps columns to Go struct → jsonResponse serializes to JSON
        ↓
React Query receives JSON → PropertiesPage renders PropertyCard for each result
```

The leases query shows the same flow but adds a JOIN step — the database assembles data from multiple tables before Go even sees it, so neither the API layer nor the frontend needs to make extra requests to resolve names.
