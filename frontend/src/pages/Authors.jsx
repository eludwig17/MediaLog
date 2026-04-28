import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import { getAuthors } from '../services/api.js'
import './Authors.css'

export default function Authors() {
    const [authors, setAuthors]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [search, setSearch]     = useState('')
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        getAuthors()
            .then(data => { setAuthors(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const filtered = authors.filter(a => {
        const full = `${a.firstName} ${a.lastName}`.toLowerCase()
        return full.includes(search.toLowerCase())
    })

    return (
        <div className="page">
            <NavBar />
            <main className="authors-main">
                <div className="page-header">
                    <h1 className="page-title">Authors</h1>
                    <span className="page-count">{filtered.length} authors</span>
                </div>

                <div className="search-wrap">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search authors"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>

                {loading ? (
                    <p className="loading-msg">Loading authors</p>
                ) : (
                    <div className="list">
                        {filtered.map(author => {
                            const isOpen = expanded === author.authorID
                            const name = `${author.firstName} ${author.middleName ? author.middleName + ' ' : ''}${author.lastName}`.trim()
                            const initials = `${author.firstName?.[0] || ''}${author.lastName?.[0] || ''}`

                            return (
                                <div key={author.authorID} className="list-item">
                                    <div
                                        className="list-row"
                                        onClick={() => setExpanded(isOpen ? null : author.authorID)}
                                    >
                                        <div className="author-avatar">{initials}</div>
                                        <div className="author-info">
                                            <div className="author-name">{name || 'Unknown'}</div>
                                            <div className="author-meta">
                                                {[author.country, author.homeTown].filter(Boolean).join(' · ') || 'No location data'}
                                            </div>
                                        </div>
                                        <span className="chevron">{isOpen ? '^' : 'v'}</span>
                                    </div>

                                    {isOpen && (
                                        <div className="detail-rows">
                                            {[
                                                { label: 'Author ID',    value: author.authorID },
                                                { label: 'Date of Birth',value: author.dateOfBirth || '—' },
                                                { label: 'Hometown',     value: author.homeTown   || '—' },
                                                { label: 'Country',      value: author.country    || '—' },
                                            ].map(d => (
                                                <div key={d.label} className="detail-row">
                                                    <span className="detail-label">{d.label}</span>
                                                    <span className="detail-value">{d.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {filtered.length === 0 && (
                            <p className="loading-msg">No authors found</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}