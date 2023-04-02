// App.js
import { Route, Routes } from 'react-router-dom'

import { Entry } from './Entry'
import { Game } from './Game'

export const Room = () => {
  return (
    <Routes>
      <Route path='/:room_id/player/:name' element={<Entry />} />
      <Route path='/:room_id/player/:name/game' element={<Game />} />
    </Routes>
  )
}
