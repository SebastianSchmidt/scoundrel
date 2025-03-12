import { createContext } from 'react'
import { createGame, Game, GameDispatch } from '../game.ts'

export const GameContext = createContext<Game>(createGame())
export const GameDispatchContext = createContext<GameDispatch>(() => {})
