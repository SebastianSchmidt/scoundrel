import { useContext } from 'react'
import { GameContext } from './GameContext.ts'
import { Card } from '../game.ts'
import { CardDraggable } from './CardDraggable.tsx'
import { CardPlaceholder } from './CardPlaceholder.tsx'
import classes from './RoomView.module.css'

export function RoomView() {
  const { room } = useContext(GameContext)

  return (
    <div className={classes.room}>
      <RoomCard card={room[0]} />
      <RoomCard card={room[1]} />
      <RoomCard card={room[2]} />
      <RoomCard card={room[3]} />
    </div>
  )
}

function RoomCard({ card }: { card: Card | null }) {
  return card ? <CardDraggable card={card} /> : <CardPlaceholder />
}
