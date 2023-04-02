// App.js
import { Route, Routes } from 'react-router-dom'

import { Entry } from './Entry'
import { Game } from './Game'

export const Room = () => {
  return (
    <Routes>
      <Route path='/' element={<Entry />} />
      <Route path='/game' element={<Game />} />
    </Routes>
  )
}
