import React, { useCallback, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { PlayerTable } from './PlayerTable'
import { RoomContext } from './RoomContext'

export function Entry() {
  const { websocketUrl, roomState, setRoomState, setPlayers } = useContext(RoomContext)
  const { sendMessage, lastMessage, readyState } = useWebSocket(websocketUrl)

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
