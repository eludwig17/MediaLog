import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import { getPublishers } from '../services/api.js'
import './Publishers.css'

export default function Publishers() {
    const [publishers, setPublishers] = useState([])
    const [loading, setLoading]       = useState(true)
    const [search, setSearch]         = useState('')
    const [expanded, setExpanded]     = useState(null)

    useEffect(() => {
        getPublishers()
            .then(data => { setPublishers(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const filtered = publishers.filter(p =>
        (p.name || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="page">
            <NavBar />
            <main className="publishers-main">
                <div className="page-header">
                    <h1 className="page-title">Publishers</h1>
                    <span className="page-count">{filtered.length} publishers</span>
                </div>

                <div className="search-wrap">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search publishers"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>

                {loading ? (
                    <p className="loading-msg">Loading publishers</p>
                ) : (
                    <div className="list">
                        {filtered.map(pub => {
                            const isOpen = expanded === pub.publisherUID

                            return (
                                <div key={pub.publisherUID} className="list-item">
                                    <div
                                        className="list-row"
                                        onClick={() => setExpanded(isOpen ? null : pub.publisherUID)}
                                    >
                                        <div className="pub-avatar">
                                            {pub.name?.[0] || '?'}
                                        </div>
                                        <div className="pub-info">
                                            <div className="pub-name">{pub.name || 'Unknown'}</div>
                                            <div className="pub-meta">{pub.location || 'No location data'}</div>
                                        </div>
                                        <span className="chevron">{isOpen ? '^' : 'v'}</span>
                                    </div>

                                    {isOpen && (
                                        <div className="detail-rows">
                                            {[
                                                { label: 'Publisher ID', value: pub.publisherUID },
                                                { label: 'Location',     value: pub.location || '—' },
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
                            <p className="loading-msg">No publishers found</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}