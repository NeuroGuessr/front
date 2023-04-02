import { createContext, useState } from 'react'
import type { SendMessage } from 'react-use-websocket'
import { ReadyState } from 'react-use-websocket'

export interface Player {
  name: string
  total_score: number
  game_score: number
  finishedLevel: number
}

export interface RoomState {
  id: number
  screen: 'lobby' | 'game'
}

interface RoomContextType {
  websocketUrl: string | null
  setWebsocketUrl: (websocketUrl: string) => void
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
  websocketUrl: null,
  setWebsocketUrl: () => {},
  roomState: { id: -1, screen: 'lobby' },
  setRoomState: () => {},
  roomId: null,
  setRoomId: () => {},
  players: [],
  setPlayers: () => {},
  yourName: null,
  setYourName: () => {},
})

export const RoomContextProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [roomState, setRoomState] = useState<RoomState>({ id: -1, screen: 'lobby' })
  const [roomId, setRoomId] = useState<number | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [yourName, setYourName] = useState<string | null>(null)
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null)

  console.log(websocketUrl)

  return (
    <RoomContext.Provider
      value={{
        websocketUrl,
        setWebsocketUrl,
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
