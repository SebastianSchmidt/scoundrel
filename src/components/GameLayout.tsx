import { RoomView } from './RoomView.tsx'
import classes from './GameLayout.module.css'
import { ActionsView } from './ActionsView.tsx'
import { ScoreView } from './ScoreView.tsx'
import { ProgressView } from './ProgressView.tsx'

export function GameLayout() {
  return (
    <div className={classes.layout}>
      <ProgressView />
      <RoomView />
      <ActionsView />
      <ScoreView />
    </div>
  )
}
