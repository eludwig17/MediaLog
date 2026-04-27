import React from 'react'
import './BookCard.css'

// just some different colors that are used for the background of each card for book
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

const STATUS_LABELS  = { reading: 'Reading', done: 'Finished', want: 'Want to read' }
const STATUS_CLASSES = { reading: 'badge-reading', done: 'badge-done', want: 'badge-want' }

export default function BookCard({ book }) {
    const color = getColor(book.title || '')
    const hasProgress = book.status === 'reading' && book.pagesTotal > 0
    const pct = hasProgress ? Math.round((book.pagesRead / book.pagesTotal) * 100) : 0

    return (
        <div className="book-card">
            <div className="book-spine" style={{ background: color }}>
                <span className={`book-badge ${STATUS_CLASSES[book.status] || 'badge-want'}`}>
                    {STATUS_LABELS[book.status] || book.status}
                </span>
            </div>
            <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                {hasProgress && (
                    <div className="book-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="progress-label">
                            {book.pagesRead} / {book.pagesTotal} pages · {pct}%
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}