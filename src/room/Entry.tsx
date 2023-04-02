import React, { useCallback, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { BACKEND_URL } from '../config'
import { PlayerTable } from './PlayerTable'
import { RoomContext } from './RoomContext'

export function Entry() {
  const { roomState, setRoomState, setPlayers } = useContext(RoomContext)
  const params = useParams()
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://${BACKEND_URL}/ws/room/${params.room_id}/player/${params.name}`,
  )

  const navigate = useNavigate()

  // navigate
  useEffect(() => {
    if (roomState.screen == 'game') {
      navigate('game')
    }
  }, [navigate, roomState])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage.data == 'string') {
      const json = JSON.parse(lastMessage.data)
      console.log(json)
      if (json.type == 'room') {
        setPlayers(json.players)
      }
    }
  }, [lastMessage, setPlayers])

  const onStartGame = useCallback(() => {
    const message = JSON.stringify({ type: 'start_game' })
    sendMessage(message)
    setRoomState({ ...roomState, screen: 'game' })
  }, [roomState, sendMessage, setRoomState])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex:', flexDirection: 'column' }}>
        <div>Websocket status: {connectionStatus}</div>

        <button onClick={onStartGame}>Start game!</button>
      </div>
      <PlayerTable />
    </div>
  )
}
