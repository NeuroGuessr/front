import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export function Room() {
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8000/ws/room/1')

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

  const [name, setName] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  // getting all users
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
    console.log(message)
    sendMessage(JSON.stringify(message))
  }, [name, sendMessage])

  const onChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    },
    [setName],
  )

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
    </div>
  )
}
