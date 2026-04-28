import React, { useState } from 'react'
import { updateBook } from '../services/api.js'
import './BookModal.css'

const STATUS_OPTIONS = [
    { value: 'reading', label: 'Reading' },
    { value: 'done', label: 'Finished' },
    { value: 'want', label: 'Want to read' },
]

export default function BookModal({ book, onClose, onStatusUpdate }) {
    const [status, setStatus] = useState(book.status || '')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleStatusSave = async () => {
        setSaving(true)
        try {
            await updateBook(book.isbn || book._id,{ status })
            setSaved(true)
            onStatusUpdate?.(book._id, status)
            setTimeout(() => setSaved(false), 2000)
        } catch (e) {
            console.error('Failed to update status', e)
        } finally {
            setSaving(false)
        }
    }

    const details = [
        { label: 'ISBN', value: book.isbn || '—' },
        { label: 'Publish Year', value: book.publishYear || '—' },
        { label: 'Language', value: book.locale || '—' },
        { label: 'Genres', value: book.genres?.join(', ') || '—' },
        { label: 'Author IDs', value: book.authorIDs?.join(', ') || '—' },
        { label: 'Publisher IDs', value: book.publisherUIDs?.join(', ') || '—' },
    ]

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{book.title}</h2>
                        {book.genres?.[0] && (
                            <span className="modal-genre">{book.genres[0]}</span>
                        )}
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-status-section">
                    <span className="modal-label">Reading status</span>
                    <div className="status-options">
                        {STATUS_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                className={`status-btn ${status === opt.value ? 'status-active' : ''}`}
                                onClick={() => setStatus(opt.value)}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <button
                        className="status-save"
                        onClick={handleStatusSave}
                        disabled={saving || !status}>
                        {saving ? 'Saving' : saved ? 'Saved' : 'Save status'}
                    </button>
                </div>

                <div className="modal-body">
                    {details.map(d => (
                        <div key={d.label} className="modal-row">
                            <span className="modal-label">{d.label}</span>
                            <span className="modal-value">{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}