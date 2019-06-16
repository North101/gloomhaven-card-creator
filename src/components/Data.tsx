import { Value, ValueJSON } from 'slate'


export interface SummonData {
  visible: boolean
  name: Value
  box1: Value
  box2: Value
  box3: Value
  box4: Value
  box5: Value
}

export interface SummonJSON {
  visible: boolean
  name: string
  box1: ValueJSON
  box2: ValueJSON
  box3: ValueJSON
  box4: ValueJSON
  box5: ValueJSON
}

export interface CardData {
  color: string
  actions: {
    [key: string]: ActionData,
  }
  hexes: {
    [key: string]: HexData,
  }
  title: Value
  level: Value
  initiative: Value
  summon: {
    top: SummonData,
    bottom: SummonData,
  }
}

export interface CardJSON {
  color: string
  actions: {
    [key: string]: ActionJSON,
  }
  hexes: {
    [key: string]: HexData,
  }
  title: string
  level: string
  initiative: string
  summon: {
    top: SummonJSON,
    bottom: SummonJSON,
  }
}

export interface ActionData {
  value: Value
  x: number
  y: number
}

export interface ActionJSON {
  value: ValueJSON
  x: number
  y: number
}

export interface Hex {
  row: number
  column: number
  type: 'add' | 'enemy' | 'player' | 'enhancement'
}

export interface HexData {
  hexes: Hex[]
  height: number
  width: number
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
}
