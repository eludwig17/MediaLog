# Database & API Design

---

## Database Structure

### Standalone Entities

#### Author
| Field | Type | Notes |
|-------|------|-------|
| `AuthorUID` | String | Primary Key |
| `FirstName` | String | |
| `MiddleName` | String | Nullable |
| `LastName` | String | |
| `DateOfBirth` | Date | |
| `Hometown` | String | |
| `Country` | String | |

#### Publisher
| Field | Type | Notes |
|-------|------|-------|
| `PublisherUID` | String | Primary Key |
| `Name` | String | |
| `Location` | String | |

---

### Dependent Entities

#### Book
| Field | Type | Notes |
|-------|------|-------|
| `ISBN` | String | Primary Key / UID |
| `Title` | String | |
| `AuthorUID` | String | FK → Author |
| `PublishYear` | Int | |
| `PublisherUID` | String | FK → Publisher |
| `Locale` | String | e.g. `"en"`, `"fr"` |
| `TBA` | — | To be determined |

---

## API Routes

**Base URL:** `https://{backend_url}:{port}/api`

### Books
```
GET /api/books
GET /api/books?search=%s&lang=en&publish_year>{date}
GET /api/books?limit=%d&page=%d
```

### Authors
```
GET /api/authors
GET /api/authors?search=%s
GET /api/authors?limit=%d&page=%d
```

### Publishers
```
GET /api/publishers
GET /api/publishers?search=%s
GET /api/publishers?limit=%d&page=%d
```

### Example Request
```
GET https://{backend_url}:{port}/api/books?search="lang=en,publish_year=>2018-5-2"
```

---

## Request Flow

```
User clicks button on Frontend
        │
        ▼
Webpage needs to render a list of books
        │
        ▼
Frontend sends GET request to backend
        │   GET {backend_url}/api/books
        ▼
[Anthony] Backend runs SQL query
        │   SELECT * FROM books
        ▼
[Brian]  Convert SQL results → Python OOP objects (classes)
        │
        ▼
[Backend] Serialize objects → JSON
        │
[Anthony] Return JSON to client
        │
        ▼
Client receives and renders the list
```

---

## Search Query Parsing

**Incoming request:**
```
GET /api/books?search="lang=en,publish_year=>2018-5-2"
```

**Request body / query param:**
```json
{ "search": "lang=en,publish_year=>2018-5-2" }
```

**Parsing logic:**
```python
tokens = search.split(',')
# tokens = ["lang=en", "publish_year=>2018-5-2"]

for token in tokens:
    sub_tokens = token.split('=', 1)
    query_key   = sub_tokens[0]   # e.g. "lang"
    query_value = sub_tokens[1]   # e.g. "en"

    match query_key:
        case "lang":
            results = db.query("SELECT * FROM books WHERE locale = ?", query_value)

        case "publish_year":
            results = db.query("SELECT * FROM books WHERE publish_year > ?", query_value)

        case "last_name":
            results = db.query("SELECT * FROM books WHERE last_name = ?", query_value)

    return to_json(results) 