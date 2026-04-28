import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import './AddBook.css'

const EMPTY = {
    isbn: '', title: '', authorIDs: '', publishYear: '',
    publisherUIDs: '', locale: '', genres: ''
}

export default function AddBook() {
    const navigate = useNavigate()
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

    const handleChange = e =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.title) { setError('Title is required'); return }
        setError(null)
        setSaving(true)
        try {
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
            const res = await fetch(`${backendURL}/api/books/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isbn: form.isbn,
                    title: form.title,
                    authorIDs: form.authorIDs.split(',').map(s => s.trim()).filter(Boolean),
                    publishYear: form.publishYear,
                    publisherUIDs: form.publisherUIDs.split(',').map(s => s.trim()).filter(Boolean),
                    locale: form.locale,
                    genres: form.genres.split(',').map(s => s.trim()).filter(Boolean),
                })
            })
            if (!res.ok) throw new Error('Failed')
            navigate('/')
        } catch {
            setError('Failed to add book')
        } finally {
            setSaving(false)
        }
    }

    const fields = [
        { name: 'title', label: 'Title', required: true  },
        { name: 'isbn', label: 'ISBN', required: false },
        { name: 'authorIDs', label: 'Author IDs', required: false },
        { name: 'publishYear', label: 'Publish Year', required: false },
        { name: 'publisherUIDs', label: 'Publisher IDs', required: false },
        { name: 'locale', label: 'Language', required: false },
        { name: 'genres', label: 'Genres', required: false }
    ]

    return (
        <div className="page">
            <NavBar />
            <main className="add-main">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                <h1 className="add-title">Add a book</h1>
                <p className="add-desc">Adding a book to the book tracking catalog</p>

                {error && <div className="add-error">{error}</div>}

                <div className="add-form">
                    {fields.map(f => (
                        <div key={f.name} className="field">
                            <label className="field-label">
                                {f.label}
                                {f.required && <span className="required">*</span>}
                            </label>
                            <input
                                className="field-input"
                                type="text"
                                name={f.name}
                                placeholder={f.placeholder}
                                value={form[f.name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>

                <div className="add-actions">
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? 'Adding' : 'Add book'}
                    </button>
                    <button className="btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </main>
        </div>
    )
}