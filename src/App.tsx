import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Home } from './Home'
import { Room } from './room/Room'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id/*' element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}
