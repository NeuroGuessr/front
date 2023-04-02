// App.js
import { Route, Routes } from 'react-router-dom'

import { Entry } from './Entry'
import { Game } from './Game'
import { RoomContextProvider } from './RoomContext'

export const Room = () => {
  return (
    <RoomContextProvider>
      <Routes>
        <Route path='/' element={<Entry />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </RoomContextProvider>
  )
}
