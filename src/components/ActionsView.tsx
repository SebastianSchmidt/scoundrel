import classes from './ActionsView.module.css'
import { CardPlaceholder } from './CardPlaceholder.tsx'
import { PlayerWeapon } from './PlayerWeapon.tsx'
import { PlayerHealth } from './PlayerHealth.tsx'
import { SkipRoomButton } from './SkipRoomButton.tsx'

export function ActionsView() {
  return (
    <div className={classes.actions}>
      <SkipRoomButton />
      <PlayerWeapon />
      <PlayerHealth />
      <CardPlaceholder />
    </div>
  )
}
