import classes from './CardDraggable.module.css'
import { Card } from '../game.ts'
import { useContext, useMemo } from 'react'
import classNames from 'classnames'
import { CardStatic } from './CardStatic.tsx'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GameContext } from './GameContext.ts'

export type CardDraggableProps = {
  card: Card
}

export function CardDraggable({ card }: CardDraggableProps) {
  const { running } = useContext(GameContext)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.toString(),
    data: card,
    disabled: !running,
  })

  const cardStyle = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
    }),
    [transform],
  )
  const dragging = !!cardStyle.transform

  const cardClassName = useMemo(
    () => classNames(classes.card, { [classes.draggable]: running }, { [classes.dragging]: dragging }),
    [running, dragging],
  )

  return (
    <CardStatic
      card={card}
      className={cardClassName}
      style={cardStyle}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    />
  )
}
