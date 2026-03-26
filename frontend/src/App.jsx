import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend} from 'react-dnd-html5-backend'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import './App.css'


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
            <DndProvider backend={HTML5Backend}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />"
                </Routes>
            </DndProvider>
        </BrowserRouter>
    )
}
