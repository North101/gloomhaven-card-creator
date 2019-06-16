import React from 'react'

import classNames from 'classnames'
import deepEquals from 'fast-deep-equal'

import { Hex, HexData } from './Data'


export interface HexProps {
  cursor: 'move' | 'edit'
  deleteHex: () => void
  onDragHex: (x: number, y: number) => void
  onHexChange: (data: HexData) => void

  data: HexData
}

export interface HexState {
  cachedHexes?: Hex[]
}

export class HexGrid extends React.Component<HexProps, HexState> {
  static types = {
    'add': 0,
    'enemy': 1,
    'player': 2,
    'enhancement': 3,
  }

  constructor(props: HexProps) {
    super(props)

    this.state = {
      cachedHexes: HexGrid.getCachedHexes(props.data.hexes),
    }
  }

  static getCachedHexes = (hexes: Hex[]) => {
    let cachedHexes = hexes.flatMap((hex) => {
      const columnOffset = Math.abs(hex.row % 2) === 1 ? 0 : -1
      return [
        {
          row: hex.row - 1,
          column: hex.column + columnOffset,
          type: 'add',
        },
        {
          row: hex.row - 1,
          column: hex.column + 1 + columnOffset,
          type: 'add',
        },
        {
          row: hex.row,
          column: hex.column + 1,
          type: 'add',
        },
        {
          row: hex.row,
          column: hex.column,
          type: hex.type,
        },
        {
          row: hex.row,
          column: hex.column - 1,
          type: 'add',
        },
        {
          row: hex.row + 1,
          column: hex.column + columnOffset,
          type: 'add',
        },
        {
          row: hex.row + 1,
          column: hex.column + 1 + columnOffset,
          type: 'add',
        },
      ] as Hex[]
    }).filter((hex, index, array) => {
      // filter out duplicates
      return !array.some((otherHex, otherIndex) => {
        return otherHex !== hex &&
          otherHex.column === hex.column &&
          otherHex.row === hex.row &&
          (
            HexGrid.types[hex.type] < HexGrid.types[otherHex.type] ||
            (hex.type === otherHex.type && index > otherIndex)
          )
      })
    })

    if (cachedHexes.length === 0) {
      cachedHexes = [
        {
          row: 0,
          column: 0,
          type: 'add',
        },
      ]
    }

    return cachedHexes
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data.hexes) {
      return {
        cachedHexes: HexGrid.getCachedHexes(props.data.hexes),
      }
    }
    return null
  }

  onClick = (e: any, hex: Hex) => {
    if (e.button !== 0 || this.props.cursor === 'move') return

    e.preventDefault()
    e.stopPropagation()

    let newType
    if (hex.type === 'add') {
      newType = 'enemy'
    } else if (hex.type === 'enemy') {
      newType = 'player'
    } else if (hex.type === 'player') {
      newType = 'enhancement'
    } else {
      newType = null
    }

    const hexes = this.props.data.hexes.filter(otherHex => {
      return otherHex.column !== hex.column || otherHex.row !== hex.row
    })
    if (newType) {
      hexes.push({
        ...hex,
        type: newType,
      })
    }

    this.props.onHexChange({
      ...this.props.data,
      hexes,
    })
  }

  onMouseDown = (e: any) => {
    if (e.button !== 0 || this.props.cursor !== 'move') return

    e.preventDefault()
    e.stopPropagation()

    this.props.onDragHex(e.clientX - this.props.data.x, e.clientY - this.props.data.y)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || !deepEquals(this.state, nextState)
  }

  render() {
    const { cursor, data } = this.props
    const { height, width, orientation, x, y } = data
    const { cachedHexes } = this.state

    return (
      <div
        className={classNames({
          "hexgrid": true,
          [this.props.cursor || '']: true,
        })}
        style={{
          top: y,
          left: x,
        }}
        onMouseDown={this.onMouseDown}
      >
        {cachedHexes && cachedHexes.filter(hex => {
          return (cursor === 'edit') || hex.type !== 'add'
        }).map((hex, index) => {
          const columnOffset = Math.abs(hex.row % 2) === 1 ? width / 2 : 0
          const rowPos = `${(hex.row * height * 3 / 4)}px`
          const columnPos = `${(hex.column * width) + columnOffset}px`

          let transform: string | undefined
          let top: string
          let left: string
          if (orientation === 'vertical') {
            top = rowPos
            left = columnPos
            transform = undefined
          } else {
            top = columnPos
            left = rowPos
            transform = 'rotate(90deg)'
          }
          return <img
            key={`hex_${hex.column}_${hex.row}`}
            alt={`hex_${hex.column}_${hex.row}`}
            src={require(`../assets/hex-${hex.type}.small.png`)}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              position: 'absolute',
              top: top,
              left: left,
              transform: transform,
            }}
            onClick={(e) => this.onClick(e, hex)}
          />
        })}
      </div>
    )
  }
}