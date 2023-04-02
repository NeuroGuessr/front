import { createContext, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import type { SendMessage } from 'react-use-websocket'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { BACKEND_URL } from '../config'

export interface Websocket {
  sendMessage: SendMessage
  // eslint-disable-next-line
  lastMessage: MessageEvent<any> | null
  readyState: ReadyState
}
export interface Player {
  name: string
  total_score: number
  game_score: number
}

export type RoomState = 'lobby' | 'game'

interface RoomContextType {
  websocket: Websocket
  roomState: RoomState
  setRoomState: (newRoomState: RoomState) => void
  roomId: number | null
  setRoomId: (newRoomId: number) => void
  players: Player[]
  setPlayers: (newPlayers: Player[]) => void
  yourName: string | null
  setYourName: (newName: string) => void
}

export const RoomContext = createContext<RoomContextType>({
  websocket: { sendMessage: () => {}, lastMessage: null, readyState: ReadyState.UNINSTANTIATED },
  roomState: 'lobby',
  setRoomState: () => {},
  roomId: null,
  setRoomId: () => {},
  players: [],
  setPlayers: () => {},
  yourName: null,
  setYourName: () => {},
})

export const RoomContextProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [roomState, setRoomState] = useState<RoomState>('lobby')
  const [roomId, setRoomId] = useState<number | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [yourName, setYourName] = useState<string | null>(null)

  const params = useParams()
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${BACKEND_URL}/ws/room/${params.id}`)

  return (
    <RoomContext.Provider
      value={{
        websocket: { sendMessage, lastMessage, readyState },
        roomState,
        setRoomState,
        roomId,
        setRoomId,
        players,
        setPlayers,
        yourName,
        setYourName,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}
