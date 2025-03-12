import { Card } from '../game'
import classes from './CardStatic.module.css'
import classNames from 'classnames'
import { CSSProperties, useMemo } from 'react'

export type CardStaticProps = {
  card: Card
  className?: string
  style?: CSSProperties
  [key: string]: unknown
}

export function CardStatic({ card, className, style, ...other }: CardStaticProps) {
  const { suit, rank } = card
  const wrapperClassName = useMemo(() => classNames(classes.card, className), [className])

  return (
    <div className={wrapperClassName} style={style} {...other}>
      <div className={classes.line}>
        <div className={classNames(classes.symbol, classes[suit.id])}>{suit.symbol}</div>
        <div>{rank.value}</div>
      </div>
      <div className={classNames(classes.center, classes[suit.id])}>
        <span>
          {suit.symbol} {rank.symbol}
        </span>
      </div>
      <div className={classes.line}>
        <div>{rank.value}</div>
        <div className={classNames(classes.symbol, classes[suit.id])}>{suit.symbol}</div>
      </div>
    </div>
  )
}
