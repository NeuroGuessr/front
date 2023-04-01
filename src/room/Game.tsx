import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

import { BACKEND_URL } from '../config'

export function Game() {
  const params = useParams()
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${BACKEND_URL}/ws/room/${params.id}`)

  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage == 'string') {
      const json = JSON.parse(lastMessage)

      if (json.type == 'game') {
        setIsGameLoaded(true)
        setImages(json.images)
        setLabels(json.labels)
      }
    }
  }, [lastMessage])

  if (!isGameLoaded) {
    return <div>Game!</div>
  } else {
    return (
      <div>
        <div>
          {images.map((imageUrl, idx) => (
            <img src={`${BACKEND_URL}/static/${imageUrl}`} key={idx} />
          ))}
        </div>
        <div>{labels}</div>
      </div>
    )
  }
}
