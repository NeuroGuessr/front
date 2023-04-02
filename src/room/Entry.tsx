import type { ChangeEvent } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReadyState } from 'react-use-websocket'

import { RoomContext } from './RoomContext'

export function Entry() {
  const { websocket, roomState, setRoomState, players, setPlayers, setYourName, yourName } = useContext(RoomContext)
  const { sendMessage, lastMessage, readyState } = websocket

  const navigate = useNavigate()

  // navigate
  useEffect(() => {
    if (roomState == 'game') {
      navigate('game')
    }
  }, [roomState])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage == 'string') {
      const json = JSON.parse(lastMessage)
      if (json.type == 'current_players') {
        setPlayers(json.players)
      }
    }
  }, [lastMessage])

  //
  const sendCreateUser = useCallback(() => {
    const message = JSON.stringify({ type: 'create_player', name: yourName })
    sendMessage(message)
  }, [yourName, sendMessage])

  const onChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setYourName(event.target.value)
    },
    [setYourName],
  )

  const onStartGame = useCallback(() => {
    const message = JSON.stringify({ type: 'start_game' })
    sendMessage(message)
    setRoomState('game')
  }, [])

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
      </div>
      <button onClick={onStartGame}>Start game!</button>
    </div>
  )
}
