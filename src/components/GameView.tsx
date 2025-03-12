import {
  canConsumeHealthPotion,
  canEquipWeapon,
  canFightMonsterArmed,
  canFightMonsterBarehanded,
  Card,
  consumeHealthPotion,
  equipWeapon,
  fightMonsterArmed,
  fightMonsterBarehanded,
  Game,
  GameDispatch,
  useGameReducer,
} from '../game.ts'
import { GameContext, GameDispatchContext } from './GameContext.ts'
import { GameLayout } from './GameLayout.tsx'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core/dist/types'
import { useCallback } from 'react'
import { PLAYER_HEALTH_DROP_ID } from './PlayerHealth.tsx'
import { PLAYER_WEAPON_DROP_ID } from './PlayerWeapon.tsx'

export function GameView() {
  const [game, dispatch] = useGameReducer()

  const onDragEnd = useCallback((event: DragEndEvent) => handleDragEnd(event, game, dispatch), [game, dispatch])

  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        <DndContext onDragEnd={onDragEnd}>
          <GameLayout />
        </DndContext>
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  )
}

function handleDragEnd(event: DragEndEvent, game: Game, dispatch: GameDispatch) {
  const { active, over } = event
  const card = active.data.current as Card
  const target = over?.id

  if (!target) {
    return
  }

  switch (target) {
    case PLAYER_WEAPON_DROP_ID:
      handlePlayerWeaponDrop(game, card, dispatch)
      break
    case PLAYER_HEALTH_DROP_ID:
      handlePlayerHealthDrop(card, dispatch)
      break
  }
}

function handlePlayerWeaponDrop(game: Game, card: Card, dispatch: GameDispatch) {
  if (canEquipWeapon(card)) {
    dispatch(equipWeapon(card))
  } else if (canFightMonsterArmed(game, card)) {
    dispatch(fightMonsterArmed(card))
  }
}

function handlePlayerHealthDrop(card: Card, dispatch: GameDispatch) {
  if (canFightMonsterBarehanded(card)) {
    dispatch(fightMonsterBarehanded(card))
  } else if (canConsumeHealthPotion(card)) {
    dispatch(consumeHealthPotion(card))
  }
}
