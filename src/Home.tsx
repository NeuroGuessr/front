import React, { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { BACKEND_URL } from './config'
import { RoomContext } from './RoomContext'

export function Home() {
  const { setYourName } = useContext(RoomContext)

  const navigate = useNavigate()

  const [nickname, setNickname] = useState<string>('przemek')
  const [roomId, setRoomId] = useState<number>(1)

  const createRoom = useCallback(() => {
    fetch(`http://${BACKEND_URL}/room`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        setYourName(nickname)
        navigate(`room/${data.room_id}/player/${nickname}`)
      })
  }, [navigate, nickname, setYourName])

  const joinRoom = useCallback(() => {
    navigate(`room/${roomId}/player/${nickname}`)
  }, [navigate, nickname, roomId])

  return (
    <div>
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
