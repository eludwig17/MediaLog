import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Authors from './pages/Authors.jsx'
import Publishers from './pages/Publishers.jsx'
export default function App(){
    return (
        <BrowserRouter>
           <Routes>
               <Route path="/" element={<Home />} />
                <Route path="/authors"    element={<Authors />}    />
                <Route path="/publishers" element={<Publishers />} />
           </Routes>
        </BrowserRouter>
    )
}
