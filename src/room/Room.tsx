// App.js
import { Route, Routes } from 'react-router-dom'

import { Entry } from './Entry'
import { Game } from './Game'

export const Room = () => {
  return (
    <>
      <Routes>
        <Route path='/:id' element={<Entry />} />
        <Route path='/:id/game' element={<Game />} />
      </Routes>
    </>
  )
}
