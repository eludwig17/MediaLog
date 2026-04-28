import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import BookCard from '../components/BookCard.jsx'
import BookModal from '../components/BookModal.jsx'
import { getBooks } from '../services/api.js'
import './Home.css'

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Reading', value: 'reading' },
    { label: 'Finished', value: 'done' },
    { label: 'Want to read', value: 'want' }
]

export default function Home() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const [activeFilter, setActiveFilter] = useState('all')

    useEffect(() => {
        getBooks()
            .then(data => { setBooks(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const filtered = books.filter(book => {
    const matchesSearch = (book.title || '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === 'all' || book.status === activeFilter
    return matchesSearch && matchesFilter
    })

    const handleStatusUpdate = (bookId, newStatus) => {
        setBooks(prev => prev.map(b =>
            b._id === bookId ? { ...b, status: newStatus } : b
        ))
        setSelected(prev => prev ? { ...prev, status: newStatus } : null)
    }

    const handleDelete = (bookId) => {
    setBooks(prev => prev.filter(b => b._id !== bookId))
    setSelected(null)
    }

    return (
        <div className="page">
            <NavBar />
            <main className="home-main">
                <div className="home-header">
                    <h1 className="home-title">Books</h1>
                    <span className="home-count">{filtered.length} titles</span>
                </div>

                <div className="search-wrap">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by Book Title"
                        value={search}
                        onChange={e => setSearch(e.target.value)}/>
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>

                <div className="filter-chips">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.value)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="loading-msg">Loading books</p>
                ) : filtered.length === 0 ? (
                    <p className="loading-msg">No books found</p>
                ) : (
                    <div className="books-grid">
                        {filtered.map(book => (
                            <BookCard
                                key={book._id}
                                book={book}
                                onClick={setSelected}/>
                        ))}
                    </div>
                )}
            </main>

            {selected && (
                <BookModal
                    book={selected}
                    onClose={() => setSelected(null)}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDelete}/>
            )}
        </div>
    )
}