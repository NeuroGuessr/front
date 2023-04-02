// App.js
import { useContext } from 'react'

import type { Player } from './RoomContext'
import { RoomContext } from './RoomContext'

export const PlayerTable = () => {
  const { players } = useContext(RoomContext)

  const renderPlayer = (player: Player, idx: number) => {
    return (
      <div key={idx} style={{ padding: 4, marginBottom: 2 }}>
        {player.name}/{player.game_score}/{player.total_score}
      </div>
    )
  }

  if (players.length == 0) {
    return <div>No players currently!</div>
  }
  return <div style={{ display: 'flex', flexDirection: 'column' }}>{players.map(renderPlayer)}</div>
}
