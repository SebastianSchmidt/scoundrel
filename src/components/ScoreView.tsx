import { useCallback, useContext } from 'react'
import { GameContext, GameDispatchContext } from './GameContext.ts'
import classes from './ScoreView.module.css'
import { restart } from '../game.ts'

export function ScoreView() {
  const { running, score } = useContext(GameContext)
  const dispatch = useContext(GameDispatchContext)

  const onRestart = useCallback(() => dispatch(restart()), [dispatch])

  if (running) {
    return <></>
  }

  const win = !!score && score > 0

  return (
    <div className={classes.scoreBackdrop}>
      <div className={classes.score}>
        <div>{win ? 'Dungeon cleared' : 'You are dead'}</div>
        <div>{score}</div>
        <button onClick={onRestart}>New game</button>
      </div>
    </div>
  )
}
