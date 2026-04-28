import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import BookCard from '../components/BookCard.jsx'
import BookModal from '../components/BookModal.jsx'
import { getBooks } from '../services/api.js'
import './Home.css'

export default function Home() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        getBooks()
            .then(data => { setBooks(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const filtered = books.filter(book =>
        (book.title || '').toLowerCase().includes(search.toLowerCase())
    )

    const handleStatusUpdate = (bookId, newStatus) => {
        setBooks(prev => prev.map(b =>
            b._id === bookId ? { ...b, status: newStatus } : b
        ))
        setSelected(prev => prev ? { ...prev, status: newStatus } : null)
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
                    onStatusUpdate={handleStatusUpdate}/>
            )}
        </div>
    )
}