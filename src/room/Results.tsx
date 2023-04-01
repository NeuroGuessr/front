import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReadyState } from 'react-use-websocket'

import type { websocketProps } from './Room'

export function Results(props: websocketProps) {
  const { sendMessage, lastMessage, readyState } = props
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage == 'string') {
      const json = JSON.parse(lastMessage)
      if (json.type == 'results') {
        console.log()
      }
    }
  }, [lastMessage])

  return <div>Results!</div>
}
