const backendURL = import.meta.env.VITE_BACKEND_URL|| 'http://localhost:5000' // fallback path for flask backend

async function request(path, options = {}) {
    const res = await fetch(`${backendURL}${path}`, options)
    if (!res.ok) throw new Error(`failed request | ${path}`)
    return res.json()
}

// book endpoints
export const getBooks = (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/books${query ? `?${query}` : ''}`)
}
export const getBook = (id) => request(`/api/books/${id}`)
export const addBook = (book) => request('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
})
export const updateBook = (id, updates) => request(`/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
})
export const deleteBook = (id) => request(`/api/books/${id}`, { method: 'DELETE' })

// authors endpoints
export const getAuthors = (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/authors${query ? `?${query}` : ''}`)
}
export const getAuthor = (id) => request(`/api/authors/${id}`)
export const addAuthor = (author) => request('/api/authors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(author),
})

// publishers endpoints
export const getPublishers = (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/publishers${query ? `?${query}` : ''}`)
}
export const getPublisher = (id) => request(`/api/publishers/${id}`)
export const addPublisher = (publisher) => request('/api/publishers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publisher),
})