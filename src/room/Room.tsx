// App.js
import { Route, Routes, useParams } from 'react-router-dom'
import type { ReadyState, SendMessage } from 'react-use-websocket'
import useWebSocket from 'react-use-websocket'

import { BACKEND_URL } from '../config'
import { Entry } from './Entry'
import { Game } from './Game'
import { Results } from './Results'

export interface websocketProps {
  sendMessage: SendMessage
  // eslint-disable-next-line
  lastMessage: MessageEvent<any> | null
  readyState: ReadyState
}

export const Room = () => {
  const params = useParams()
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${BACKEND_URL}/ws/room/${params.id}`)
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Entry sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} />}
        />
        <Route
          path='/game'
          element={<Game sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} />}
        />
        <Route
          path='/results'
          element={<Results sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} />}
        />
      </Routes>
    </>
  )
}
