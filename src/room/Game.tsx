import React, { useCallback, useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'

import { BACKEND_URL } from '../config'
import type { websocketProps } from './Room'

export function Game(props: websocketProps) {
  const { sendMessage, lastMessage, readyState } = props

  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])

  // game logic
  const [imageChosen, setImageChosen] = useState<number | null>(null)
  const [labelChosen, setLabelChosen] = useState<number | null>(null)
  const [matches, setMatches] = useState({})

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage.data == 'string') {
      const json = JSON.parse(lastMessage.data)
      if (json.type == 'level') {
        // set new level data
        setIsGameLoaded(true)
        setImages(json.images)
        setLabels(json.labels)
        // clear state
        setImageChosen(null)
        setLabelChosen(null)
        setMatches([])
      }
    }
  }, [lastMessage])

  useEffect(() => {
    if (Object.keys(matches).length == 4) {
      console.log('succes!')
      const message = JSON.stringify({
        type: 'choice',
        choices: matches,
      })
      sendMessage(message)
    }
    console.log(
      `matches: ${JSON.stringify({
        type: 'choice',
        choices: matches,
      })}`,
    )
  }, [matches])

  const chooseImage = useCallback(
    (imageIdx: number) => {
      if (labelChosen !== null) {
        setImageChosen(null)
        setLabelChosen(null)
        setMatches((prevMatches) => {
          return { ...prevMatches, [imageIdx]: labelChosen }
        })
      } else {
        setImageChosen(imageIdx)
      }
    },
    [labelChosen],
  )

  const chooseLabel = useCallback(
    (labelIdx: number) => {
      if (imageChosen !== null) {
        setImageChosen(null)
        setLabelChosen(null)
        setMatches((prevMatches) => {
          return { ...prevMatches, [imageChosen]: labelIdx }
        })
      } else {
        setLabelChosen(labelIdx)
      }
    },
    [imageChosen],
  )

  if (!isGameLoaded || readyState !== ReadyState.OPEN) {
    return <div>Loading game!</div>
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          {images.map((imageUrl, idx) => (
            <div
              key={idx}
              onClick={() => chooseImage(idx)}
              style={{
                border: '3px solid',
                borderColor: imageChosen === idx ? 'red' : 'white',
                margin: 5,
                opacity: Object.keys(matches).includes(idx.toString()) ? 0.3 : 1,
              }}
            >
              <img src={`http://${BACKEND_URL}/static/${imageUrl}`} width={200} height={200} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {labels.map((label, idx) => (
            <div
              key={idx}
              onClick={() => chooseLabel(idx)}
              style={{
                padding: 5,
                backgroundColor: '#ddd',
                margin: 2,
                border: '2px solid',
                borderColor: labelChosen === idx ? 'red' : '#ddd',
                color: Object.values(matches).includes(idx) ? '#aaa' : 'black',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
