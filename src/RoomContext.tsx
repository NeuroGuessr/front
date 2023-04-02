import { createContext, useState } from 'react'

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

  return (
    <RoomContext.Provider
      value={{
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
