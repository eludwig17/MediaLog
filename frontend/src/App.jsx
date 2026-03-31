import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';


function App() {

  return (
    <>
      <div>

      </div>
    </>
  )
}

export default function App(){
    return (
        <BrowserRouter>
           <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/about" element={<About />} />
           </Routes>
        </BrowserRouter>
    )
}
