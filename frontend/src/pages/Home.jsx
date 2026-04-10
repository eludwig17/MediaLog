import React, { useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import BookCard from '../components/BookCard.jsx'

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Reading', value: 'reading' },
    { label: 'Finished', value: 'done' },
    { label: 'Want to read', value: 'want' },
]
const placeholders = [
    { _id: '1', title: 'Frontend', author: 'Elijah', genre: 'Dev', status: 'WIP'},
    { _id: '2', title: 'BackendDB', author: 'Brian', genre: 'Dev', status: 'WIP' },
    { _id: '3', title: 'Backend1', author: 'Anthony', genre: 'Dev', status: 'WIP' },
]

export default function Home() {
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const filtered = placeholders.filter(book => {
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
                <div className="books-grid">
                    {filtered.map(book => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </main>
        </div>
    )
}