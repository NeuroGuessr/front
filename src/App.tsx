import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Home } from './Home'
import { Room } from './room/Room'
import { RoomContextProvider } from './room/RoomContext'

export function App() {
  return (
    <RoomContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:room_id/player/:name/*' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </RoomContextProvider>
  )
}
