import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './NavBar.css'

const LINKS = [
    { path: '/',           label: 'Books'      },
    { path: '/authors',    label: 'Authors'    },
    { path: '/publishers', label: 'Publishers' }
]

export default function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo"></span>
                <span className="navbar-title">Book Media Log</span>
            </div>
            <div className="navbar-links">
                {LINKS.map(link => (
                    <button
                        key={link.path}
                        className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                        onClick={() => navigate(link.path)}>
                        {link.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}