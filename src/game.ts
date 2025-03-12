import { shuffle } from 'underscore'
import { ActionDispatch, useReducer } from 'react'

export class Suit {
  static readonly CLUBS = new Suit('clubs', '♣')
  static readonly SPADES = new Suit('spades', '♠')
  static readonly HEARTS = new Suit('hearts', '♥')
  static readonly DIAMONDS = new Suit('diamonds', '♦')

  readonly id: string
  readonly symbol: string

  constructor(id: string, symbol: string) {
    this.id = id
    this.symbol = symbol
  }

  toString(): string {
    return this.symbol
  }
}

export class Rank {
  static readonly TWO = new Rank(2)
  static readonly THREE = new Rank(3)
  static readonly FOUR = new Rank(4)
  static readonly FIVE = new Rank(5)
  static readonly SIX = new Rank(6)
  static readonly SEVEN = new Rank(7)
  static readonly EIGHT = new Rank(8)
  static readonly NINE = new Rank(9)
  static readonly TEN = new Rank(10)
  static readonly JACK = new Rank(11, 'J')
  static readonly QUEEN = new Rank(12, 'Q')
  static readonly KING = new Rank(13, 'K')
  static readonly ACE = new Rank(14, 'A')

  readonly value: number
  readonly symbol: string

  constructor(value: number, symbol?: string) {
    this.value = value
    this.symbol = symbol ?? value + ''
  }

  toString(): string {
    return this.symbol
  }
}

const RANKS: Rank[] = [
  Rank.TWO,
  Rank.THREE,
  Rank.FOUR,
  Rank.FIVE,
  Rank.SIX,
  Rank.SEVEN,
  Rank.EIGHT,
  Rank.NINE,
  Rank.TEN,
  Rank.JACK,
  Rank.QUEEN,
  Rank.KING,
  Rank.ACE,
]

export class Card {
  readonly suit: Suit
  readonly rank: Rank
  readonly symbol: string
  readonly monster: boolean
  readonly weapon: boolean
  readonly healthPotion: boolean

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit
    this.rank = rank
    this.symbol = suit.toString() + rank.toString()
    this.monster = suit === Suit.CLUBS || suit === Suit.SPADES
    this.weapon = suit === Suit.DIAMONDS
    this.healthPotion = suit === Suit.HEARTS
  }

  toString(): string {
    return this.symbol
  }
}

function createSuit(suit: Suit): Card[] {
  const cards: Card[] = []

  for (const rank of RANKS) {
    cards.push(new Card(suit, rank))
  }

  return cards
}

const DECK: readonly Card[] = Object.freeze([
  ...createSuit(Suit.CLUBS),
  ...createSuit(Suit.SPADES),
  ...createSuit(Suit.HEARTS).filter((card) => card.rank.value < Rank.JACK.value),
  ...createSuit(Suit.DIAMONDS).filter((card) => card.rank.value < Rank.JACK.value),
])

type Dungeon = Card[]
type Room = Array<Card | null>
const EMPTY_ROOM = [null, null, null, null]

function createDungeon(): Dungeon {
  return shuffle(DECK)
}

export type Game = {
  running: boolean
  health: number
  healthPotionConsumed: boolean
  dungeon: Dungeon
  room: Room
  roomLastSkipped: boolean
  weapon: Card | null
  weaponLastKill: Card | null
  lastCard: Card | null
  score: number | null
}

export type Action = { type: string }
export type CardAction = Action & { card: Card }

const MAX_HEALTH = 20

export function createGame(): Game {
  return handleStateChanged({
    running: true,
    health: MAX_HEALTH,
    healthPotionConsumed: false,
    dungeon: createDungeon(),
    room: EMPTY_ROOM,
    roomLastSkipped: false,
    weapon: null,
    weaponLastKill: null,
    lastCard: null,
    score: null,
  })
}

function removeRoomCard(state: Game, card: Card): Room {
  const room = state.room

  for (let index = 0; index < room.length; index++) {
    if (room[index] === card) {
      const copy = [...room]
      copy[index] = null
      return copy
    }
  }

  throw new Error('Room card not found')
}

function countRoomCards(state: Game): number {
  return state.room.filter((card) => card !== null).length
}

export const LAST_ROOM = Math.ceil((DECK.length - 4) / 3) + 1

export function getCurrentRoom(state: Game): number {
  return LAST_ROOM - Math.ceil(state.dungeon.length / 3)
}

/* Game loop */

function handleStateChanged(changedState: Game, lastCard: Card | null = null, roomSkipped = false): Game {
  const state = lastCard ? { ...changedState, lastCard } : changedState

  if (isGameWon(state) || isGameLost(state)) {
    return calcScore(state)
  }

  if (isRoomClear(state)) {
    return revealRoom(state, roomSkipped)
  }

  return state
}

function isGameWon(state: Game): boolean {
  return state.dungeon.length === 0 && countRoomCards(state) === 0
}

function isGameLost(state: Game): boolean {
  return state.health <= 0
}

function calcScore(state: Game): Game {
  const remaining = [...state.dungeon, ...state.room]
  const minus = remaining
    .filter((card) => card?.monster)
    .map((card) => card?.rank.value ?? 0)
    .reduce((sum, card) => sum + card, 0)

  const bonus = state.lastCard?.healthPotion ? state.lastCard.rank.value : 0

  const score = state.health - minus + bonus

  return {
    ...state,
    running: false,
    score,
  }
}

function isRoomClear(state: Game): boolean {
  return countRoomCards(state) <= 1
}

function revealRoom(state: Game, roomSkipped: boolean): Game {
  const dungeon = [...state.dungeon]
  const room = [...state.room]

  for (let index = 0; index < room.length; index++) {
    if (!room[index]) {
      room[index] = dungeon.shift() as Card
    }
  }

  return {
    ...state,
    healthPotionConsumed: false,
    dungeon,
    room,
    roomLastSkipped: roomSkipped,
  }
}

/* Skip room */

const SKIP_ROOM = 'skipRoom'

export function skipRoom(): Action {
  return { type: SKIP_ROOM }
}

export function canSkipRoom(state: Game): boolean {
  return !state.roomLastSkipped && countRoomCards(state) === 4
}

function skipRoomReducer(state: Game): Game {
  if (!canSkipRoom(state)) {
    return state
  }

  const dungeon = [...state.dungeon]
  dungeon.push(...state.room.filter((card) => !!card))

  return handleStateChanged(
    {
      ...state,
      dungeon,
      room: EMPTY_ROOM,
      roomLastSkipped: true,
    },
    null,
    true,
  )
}

/* Equip weapon */

const EQUIP_WEAPON = 'equipAction'

export function equipWeapon(card: Card): CardAction {
  return { type: EQUIP_WEAPON, card }
}

export function canEquipWeapon(card: Card): boolean {
  return card.weapon
}

function equipWeaponReducer(state: Game, { card }: CardAction): Game {
  if (!canEquipWeapon(card)) {
    return state
  }

  return handleStateChanged(
    {
      ...state,
      room: removeRoomCard(state, card),
      weapon: card,
      weaponLastKill: null,
    },
    card,
  )
}

/* Consume health potion */

const CONSUME_HEALTH_POTION = 'consumeHealthPotion'

export function consumeHealthPotion(card: Card): CardAction {
  return { type: CONSUME_HEALTH_POTION, card }
}

export function canConsumeHealthPotion(card: Card): boolean {
  return card.healthPotion
}

function consumeHealthPotionReducer(state: Game, { card }: CardAction): Game {
  if (!canConsumeHealthPotion(card)) {
    return state
  }

  const { health, healthPotionConsumed } = state
  return handleStateChanged(
    {
      ...state,
      health: healthPotionConsumed ? health : Math.min(MAX_HEALTH, health + card.rank.value),
      healthPotionConsumed: true,
      room: removeRoomCard(state, card),
    },
    card,
  )
}

/* Fight monster barehanded */

const FIGHT_MONSTER_BAREHANDED = 'fightMonsterBarehanded'

export function fightMonsterBarehanded(card: Card): CardAction {
  return { type: FIGHT_MONSTER_BAREHANDED, card }
}

export function canFightMonsterBarehanded(card: Card): boolean {
  return card.monster
}

function fightMonsterBarehandedReducer(state: Game, { card }: CardAction): Game {
  if (!canFightMonsterBarehanded(card)) {
    return state
  }

  return handleStateChanged(
    {
      ...state,
      health: state.health - card.rank.value,
      room: removeRoomCard(state, card),
    },
    card,
  )
}

/* Fight monster armed */

const FIGHT_MONSTER_ARMED = 'fightMonsterArmed'

export function fightMonsterArmed(card: Card): CardAction {
  return { type: FIGHT_MONSTER_ARMED, card }
}

export function canFightMonsterArmed(state: Game, card: Card): boolean {
  return card.monster && !!state.weapon && (!state.weaponLastKill || state.weaponLastKill.rank.value > card.rank.value)
}

function fightMonsterArmedReducer(state: Game, { card }: CardAction): Game {
  if (!canFightMonsterArmed(state, card)) {
    return state
  }

  const weapon = state.weapon?.rank.value ?? 0
  const damage = Math.max(0, card.rank.value - weapon)

  return handleStateChanged(
    {
      ...state,
      health: state.health - damage,
      room: removeRoomCard(state, card),
      weaponLastKill: card,
    },
    card,
  )
}

/* Restart */

const RESTART = 'restart'

export function restart(): Action {
  return { type: RESTART }
}

function restartReducer(): Game {
  return createGame()
}

/* Reducer */

function reducer(state: Game, action: Action): Game {
  switch (action.type) {
    case SKIP_ROOM:
      return skipRoomReducer(state)
    case EQUIP_WEAPON:
      return equipWeaponReducer(state, action as CardAction)
    case CONSUME_HEALTH_POTION:
      return consumeHealthPotionReducer(state, action as CardAction)
    case FIGHT_MONSTER_BAREHANDED:
      return fightMonsterBarehandedReducer(state, action as CardAction)
    case FIGHT_MONSTER_ARMED:
      return fightMonsterArmedReducer(state, action as CardAction)
    case RESTART:
      return restartReducer()
    default:
      return state
  }
}

export type GameDispatch = ActionDispatch<[Action | CardAction]>

export function useGameReducer(): [Game, GameDispatch] {
  return useReducer(reducer, undefined, createGame)
}
