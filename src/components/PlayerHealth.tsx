import { useContext } from 'react'
import { GameContext } from './GameContext.ts'
import classes from './PlayerHealth.module.css'
import { useDroppable } from '@dnd-kit/core'

export const PLAYER_HEALTH_DROP_ID = 'health'

export function PlayerHealth() {
  const { health } = useContext(GameContext)

  const { setNodeRef } = useDroppable({ id: PLAYER_HEALTH_DROP_ID })

  return (
    <div ref={setNodeRef} className={classes.health}>
      {health} HP
    </div>
  )
}
