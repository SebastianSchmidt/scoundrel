import classes from './PlayerWeapon.module.css'
import { useContext } from 'react'
import { GameContext } from './GameContext.ts'
import { CardStatic } from './CardStatic.tsx'
import { useDroppable } from '@dnd-kit/core'

export const PLAYER_WEAPON_DROP_ID = 'weapon'

export function PlayerWeapon() {
  const { weapon, weaponLastKill } = useContext(GameContext)

  const { setNodeRef } = useDroppable({ id: PLAYER_WEAPON_DROP_ID })

  return (
    <div className={classes.weapon} ref={setNodeRef}>
      {weapon ? (
        <CardStatic card={weapon} className={classes.equipped} />
      ) : (
        <div className={classes.placeholder}>Weapon</div>
      )}
      {weaponLastKill && <CardStatic card={weaponLastKill} className={classes.lastKill} />}
    </div>
  )
}
