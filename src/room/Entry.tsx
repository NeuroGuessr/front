import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { BACKEND_URL } from '../config'

export function Entry() {
  const params = useParams()
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${BACKEND_URL}/ws/room/${params.id}`)
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage == 'string') {
      const json = JSON.parse(lastMessage)
      if (json.type == 'current_players') {
        setPlayers(json.players)
      }
    }
  }, [lastMessage])

  const sendCreateUser = useCallback(() => {
    const message = JSON.stringify({ type: 'create_player', name: name })
    sendMessage(message)
  }, [name, sendMessage])

  const onChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    },
    [setName],
  )

  const onStartGame = () => {
    const message = JSON.stringify({ type: 'start_game' })
    sendMessage(message)
    navigate('game')
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return (
    <div>
      <img src={`${BACKEND_URL}/static/frog.jpg`} />
      <div>Websocket status: {connectionStatus}</div>
      <div>
        <b>Nickname</b>
        <br />
        <input type='text' onChange={onChangeName}></input>
        <button onClick={sendCreateUser}>Join!</button>
      </div>
      <div>
        <b>All users</b>
        {players.map((player, idx) => (
          <p key={idx}>{player}</p>
        ))}
      </div>
      <button onClick={onStartGame}>Start game!</button>
    </div>
  )
}
