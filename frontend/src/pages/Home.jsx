import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import BookCard from '../components/BookCard.jsx'
import { getBooks } from '../services/api.js'
import './Home.css'

const FILTERS = [
    { label: 'All',          value: 'all'     },
    { label: 'Reading',      value: 'reading' },
    { label: 'Finished',     value: 'done'    },
    { label: 'Want to read', value: 'want'    },
]

export default function Home() {
    const [books, setBooks]               = useState([])
    const [loading, setLoading]           = useState(true)
    const [search, setSearch]             = useState('')
    const [activeFilter, setActiveFilter] = useState('all')

    useEffect(() => {
        getBooks()
    .then(data => { setBooks(data); setLoading(false) })
    .catch(() => setLoading(false))
    }, [])

    const filtered = books.filter(book => {
        const matchesFilter = activeFilter === 'all' || book.status === activeFilter
        const matchesSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className="page">
            <NavBar />
            <main className="home-main">
                <h1 className="home-title">My Library</h1>
                <div className="search-wrap">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by title or author"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-chips">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <p className="loading-msg">Loading books...</p>
                ) : (
                    <div className="books-grid">
                        {filtered.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}