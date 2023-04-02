import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { BACKEND_URL } from './config'
import { RoomContext } from './room/RoomContext'

export function Home() {
  const { setYourName, setWebsocketUrl, websocketUrl } = useContext(RoomContext)

  const { sendMessage, lastMessage, readyState } = useWebSocket(websocketUrl)
  const navigate = useNavigate()

  const [nickname, setNickname] = useState<string>('przemek')
  const [roomId, setRoomId] = useState<number>(1)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (readyState == ReadyState.OPEN) {
      const message = JSON.stringify({ type: 'create_player', name: nickname })
      sendMessage(message)
      setYourName(nickname)
    }
    if (readyState == ReadyState.OPEN && lastMessage !== null) {
      const json = JSON.parse(lastMessage.data)
      console.log(json)
      if (json.type == 'error') {
        setError(json.message)
      } else if (json.type == 'room') {
        navigate(`room/${json.room_id}`)
      }
    }
  }, [lastMessage, navigate, nickname, readyState, sendMessage, setYourName, websocketUrl])

  const createRoom = useCallback(() => {
    setWebsocketUrl(`ws://${BACKEND_URL}/ws/room/new/player/${nickname}`)
  }, [nickname, setWebsocketUrl])

  const joinRoom = useCallback(() => {
    setWebsocketUrl(`ws://${BACKEND_URL}/ws/room/${roomId}/player/${nickname}`)
  }, [nickname, roomId, setWebsocketUrl])

  return (
    <div>
      <b style={{ color: 'red' }}>{error}</b>
      <b>Enter you nickname</b>
      <br />
      <input type='text' onChange={(event) => setNickname(event.target.value)} value={nickname}></input>
      <br />
      <b>Enter room id</b>
      <br />
      <input type='number' onChange={(event) => setRoomId(parseInt(event.target.value))} value={roomId}></input>
      <br />
      <br />
      <button onClick={createRoom}>Create new room!</button>
      <br />
      <br />
      <button onClick={joinRoom}>Join!</button>
    </div>
  )
}
