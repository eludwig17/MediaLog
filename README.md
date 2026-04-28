# Database & API Design

---

## Database Structure

### Standalone Entities

#### Author
| Field | Type | Notes |
|-------|------|-------|
| `authorUID` | String | Primary Key |
| `firstName` | String | |
| `middleName` | String | Nullable |
| `lastName` | String | |
| `dateOfBirth` | Date | |
| `hometown` | String | |
| `country` | String | |

#### Publisher
| Field | Type | Notes |
|-------|------|-------|
| `publisherUID` | String | Primary Key |
| `name` | String | |
| `location` | String | |

---

### Dependent Entities

#### Book
| Field | Type | Notes |
|-------|------|-------|
| `iSBN` | String | Primary Key / UID |
| `title` | String | |
| `authorIDs` | String | FK → Author |
| `publishYear` | Int | |
| `publisherUIDs` | String | FK → Publisher |
| `locale` | String | e.g. `"en"`, `"fr"` |

---

## API Routes

**Base URL:** `https://{backend_url}:{port}/api`

### Books
```
GET /api/books
POST /api/books/add
PUT /api/books/<isbn>
DELETE /api/books/<isbn>

routes below don't exist but was in original plan
GET /api/books?search=%s&lang=en&publish_year>{date}
GET /api/books?limit=%d&page=%d
```

### Authors
```
GET /api/authors

routes below don't exist but was in original plan
GET /api/authors?search=%s
GET /api/authors?limit=%d&page=%d
```

### Publishers
```
GET /api/publishers

routes below don't exist but was in original plan
GET /api/publishers?search=%s
GET /api/publishers?limit=%d&page=%d
```

### Import Books
```
GET /books/import?url=<wikipedia_url>
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
Frontend sends GET request to backend
        │   GET {backend_url}/api/books
        ▼
[Anthony] Flask Route calls DBAPI.GetBooks()
        │   
        ▼
[Brian]  PyMongo runs db.books.find() against MongoDB
        │
        ▼
[Backend] Results serialized to JSON
        │
[Anthony] Flask Returns JSON to frontend
        │
        ▼
React renders the book list
```

---

## Search Query Parsing

Search is handled on the client-side in React. Then the frontend fetches all teh books from the `GET /api/books` and filters by title using JS Array.filter()
