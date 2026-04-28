import React from 'react'
import './BookCard.css'

const SPINE_COLORS = [
    '#1D9E75', '#D85A30', '#BA7517',
    '#3B6D11', '#533FAB', '#185FA5',
    '#993556', '#5F5E5A'
]

function getColor(title) {
    let hash = 0
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash)
    return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length]
}

const STATUS_LABELS = { reading: 'Reading', done: 'Finished', want: 'Want to read' }
const STATUS_CLASSES = { reading: 'badge-reading', done: 'badge-done', want: 'badge-want' }

export default function BookCard({ book, onClick }) {
    const color = getColor(book.title || '')
    const genre = book.genres?.[0] || ''

    return (
        <div className="book-card" onClick={() => onClick?.(book)}>
            <div className="book-spine" style={{ background: color }}>
                {book.publishYear && (
                    <span className="book-year">{book.publishYear}</span>
                )}
                {book.status && (
                    <span className={`book-badge ${STATUS_CLASSES[book.status] || ''}`}>
                        {STATUS_LABELS[book.status] || book.status}
                    </span>
                )}
            </div>
            <div className="book-info">
                <div className="book-title">{book.title}</div>
                {genre && <div className="book-genre">{genre}</div>}
            </div>
        </div>
    )
}