import classes from './ProgressView.module.css'
import { useContext, useMemo } from 'react'
import { GameContext } from './GameContext.ts'
import { getCurrentRoom, LAST_ROOM } from '../game.ts'

export function ProgressView() {
  const game = useContext(GameContext)
  const current = useMemo(() => getCurrentRoom(game), [game])

  return (
    <div className={classes.progress}>
      Room {current} / {LAST_ROOM}
    </div>
  )
}
