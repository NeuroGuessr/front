import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export function Entry() {
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://127.0.0.1:8000/ws/room/1')
  const [name, setName] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  const params = useParams()

  console.log(params)

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage == 'string') {
      const json = JSON.parse(lastMessage)
      if (json.type == 'current_players') {
        setPlayers(json.players)
      }
    }
    console.log(lastMessage)
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
