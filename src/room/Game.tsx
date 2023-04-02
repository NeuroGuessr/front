import './game.css'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SendMessage } from 'react-use-websocket'
import { ReadyState } from 'react-use-websocket'

import { AI_URL, BACKEND_URL } from '../config'
import { RoomContext } from '../RoomContext'
import { PlayerTable } from './PlayerTable'

export function Game({
  sendMessage,
  lastMessage,
  readyState,
}: {
  sendMessage: SendMessage
  // eslint-disable-next-line
  lastMessage: MessageEvent<any> | null
  readyState: ReadyState
}) {
  const { setPlayers, setRoomState, roomState } = useContext(RoomContext)
  const navigate = useNavigate()

  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false)
  const [levelNumber, setLevelNumber] = useState<number>(-1)
  const [images, setImages] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])

  // game logic
  const [imageChosen, setImageChosen] = useState<string | null>(null)
  const [labelChosen, setLabelChosen] = useState<string | null>(null)
  const [matches, setMatches] = useState({})

  // navigate
  useEffect(() => {
    if (roomState.screen == 'lobby') {
      navigate('..')
    }
  }, [navigate, roomState])

  // receiving messages
  useEffect(() => {
    if (lastMessage !== null && typeof lastMessage.data == 'string') {
      const json = JSON.parse(lastMessage.data)
      if (json.type == 'level') {
        // set new level data
        setIsGameLoaded(true)
        setImages(json.images)
        setLabels(json.labels)
        setLevelNumber(json.level_number)
        // clear state
        setImageChosen(null)
        setLabelChosen(null)
        setMatches([])
      }
      if (json.type == 'room') {
        setPlayers(json.players)
      }
      if (json.type == 'game_finished') {
        setRoomState({ ...roomState, screen: 'lobby' })
      }
    }
  }, [lastMessage, roomState, setPlayers, setRoomState])

  useEffect(() => {
    if (Object.keys(matches).length == images.length) {
      const message = JSON.stringify({
        type: 'choice',
        choices: matches,
        // eslint-disable-next-line camelcase
        level_number: levelNumber,
      })
      sendMessage(message)
    }
    console.log(
      `matches: ${JSON.stringify({
        type: 'choice',
        choices: matches,
      })}`,
    )
  }, [images.length, levelNumber, matches, sendMessage])

  const chooseImage = useCallback(
    (image: string) => {
      if (labelChosen !== null) {
        setImageChosen(null)
        setLabelChosen(null)
        setMatches((prevMatches) => {
          return { ...prevMatches, [image]: labelChosen }
        })
      } else {
        setImageChosen(image)
      }
    },
    [labelChosen],
  )

  const chooseLabel = useCallback(
    (label: string) => {
      if (imageChosen !== null) {
        setImageChosen(null)
        setLabelChosen(null)
        setMatches((prevMatches) => {
          return { ...prevMatches, [imageChosen]: label }
        })
      } else {
        setLabelChosen(label)
      }
    },
    [imageChosen],
  )

  if (!isGameLoaded || readyState !== ReadyState.OPEN) {
    return <div>Loading game!</div>
  } else {
    return (
      <div id='main'>
        <div id='timer'>some time</div>
        <div id='content'>
          <div id='imagesGrid'>
            {images.map((imageUrl, idx) => (
              <div
                key={idx}
                onClick={() => chooseImage(imageUrl)}
                className='image'
                style={{
                  border: '3px solid',
                  borderColor: imageChosen === imageUrl ? 'red' : 'white',
                  opacity: Object.keys(matches).includes(imageUrl) ? 0.3 : 1,
                }}
              >
                <img src={`http://${AI_URL}/static/${imageUrl}`} width={200} height={200} />
              </div>
            ))}
          </div>
          <div id='labelsGrid'>
            {labels.map((label, idx) => (
              <div
                key={idx}
                onClick={() => chooseLabel(label)}
                className='label'
                style={{
                  border: '2px solid',
                  borderColor: labelChosen === label ? 'red' : '#ddd',
                  backgroundColor: Object.values(matches).includes(label) ? '#aaa' : '#7F45B1',
                  color: Object.values(matches).includes(label) ? '#ccc' : '#fff',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <PlayerTable />
      </div>

      //   <div style={{ display: 'flex' }}>
      //     <div style={{ display: 'flex', flexDirection: 'column' }}>
      //       <div style={{ display: 'flex' }}>
      //         {images.map((imageUrl, idx) => (
      //           <div
      //             key={idx}
      //             onClick={() => chooseImage(imageUrl)}
      //             style={{
      //               border: '3px solid',
      //               borderColor: imageChosen === imageUrl ? 'red' : 'white',
      //               margin: 5,
      //               opacity: Object.keys(matches).includes(imageUrl) ? 0.3 : 1,
      //             }}
      //           >
      //             <img src={`http://${BACKEND_URL}/static/${imageUrl}`} width={200} height={200} />
      //           </div>
      //         ))}
      //       </div>
      //       <div style={{ display: 'flex', flexDirection: 'column' }}>
      //         {labels.map((label, idx) => (
      //           <div
      //             key={idx}
      //             onClick={() => chooseLabel(label)}
      //             style={{
      //               padding: 5,
      //               backgroundColor: '#ddd',
      //               margin: 2,
      //               border: '2px solid',
      //               borderColor: labelChosen === label ? 'red' : '#ddd',
      //               color: Object.values(matches).includes(label) ? '#aaa' : 'black',
      //             }}
      //           >
      //             {label}
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //     <PlayerTable />
      //   </div>
    )
  }
}
