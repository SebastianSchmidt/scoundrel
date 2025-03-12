import classes from './SkipRoomButton.module.css'
import { useCallback, useContext, useMemo } from 'react'
import { GameContext, GameDispatchContext } from './GameContext.ts'
import { canSkipRoom, skipRoom } from '../game.ts'

export function SkipRoomButton() {
  const game = useContext(GameContext)
  const dispatch = useContext(GameDispatchContext)

  const disabled = useMemo(() => !canSkipRoom(game), [game])
  const onSkip = useCallback(() => dispatch(skipRoom()), [dispatch])

  return (
    <div className={classes.wrapper}>
      <button onClick={onSkip} disabled={disabled}>
        Skip Room
      </button>
    </div>
  )
}
