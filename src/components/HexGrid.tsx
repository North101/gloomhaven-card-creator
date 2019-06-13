import React from 'react'


export interface Hex {
  row: number
  column: number
  type: 'enemy' | 'player' | 'hidden'
}

export interface HexProps {
  cursor: 'move' | 'text' | null
  deleteHex: () => void
  onDragHex: (x: number, y: number) => void

  hexes: Hex[]
  height: number
  width: number
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
}

export interface HexState {
  hexes: Hex[]
  cachedHexes?: Hex[]
  height: number
  width: number
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
}

export class HexGrid extends React.Component<HexProps, HexState> {
  types = {
    'hidden': 0,
    'enemy': 1,
    'player': 2,
  }

  constructor(props: HexProps) {
    super(props)

    this.state = {
      hexes: props.hexes,
      cachedHexes: this.getCachedHexes(props.hexes),
      height: props.height,
      width: props.width,
      x: props.x,
      y: props.y,
      orientation: props.orientation,
    }
  }

  getCachedHexes = (hexes: Hex[]) => {
    let cachedHexes = hexes.flatMap((hex) => {
      const columnOffset = Math.abs(hex.row % 2) === 1 ? 0 : -1
      return [
        {
          row: hex.row - 1,
          column: hex.column + columnOffset,
          type: 'hidden',
        },
        {
          row: hex.row - 1,
          column: hex.column + 1 + columnOffset,
          type: 'hidden',
        },
        {
          row: hex.row,
          column: hex.column + 1,
          type: 'hidden',
        },
        {
          row: hex.row,
          column: hex.column,
          type: hex.type,
        },
        {
          row: hex.row,
          column: hex.column - 1,
          type: 'hidden',
        },
        {
          row: hex.row + 1,
          column: hex.column + columnOffset,
          type: 'hidden',
        },
        {
          row: hex.row + 1,
          column: hex.column + 1 + columnOffset,
          type: 'hidden',
        },
      ] as Hex[]
    }).filter((hex, index, array) => {
      // filter out duplicates
      return !array.some((otherHex, otherIndex) => {
        return otherHex !== hex &&
          otherHex.column === hex.column &&
          otherHex.row === hex.row &&
          (
            this.types[hex.type] < this.types[otherHex.type] ||
            (hex.type === otherHex.type && index > otherIndex)
          )
      })
    })

    if (cachedHexes.length === 0) {
      cachedHexes = [
        {
          row: 0,
          column: 0,
          type: 'hidden',
        },
      ]
    }

    return cachedHexes
  }

  onClick = (e: any, hex: Hex) => {
    if (e.button !== 0 || this.props.cursor === 'move') return

    e.preventDefault()
    e.stopPropagation()

    let newType
    if (hex.type === 'hidden') {
      newType = 'enemy'
    } else if (hex.type === 'enemy') {
      newType = 'player'
    } else {
      newType = null
    }

    const hexes = this.state.hexes.filter(otherHex => {
      return otherHex.column !== hex.column || otherHex.row !== hex.row
    })
    if (newType) {
      hexes.push({
        ...hex,
        type: newType,
      })
    }

    this.setState({
      hexes,
      cachedHexes: this.getCachedHexes(hexes),
    })
  }

  onMouseDown = (e: any) => {
    if (e.button !== 0 || this.props.cursor !== 'move') return

    e.preventDefault()
    e.stopPropagation()

    this.props.onDragHex(e.clientX - this.props.x, e.clientY - this.props.y)
  }

  render() {
    const { cursor, x, y } = this.props
    const { cachedHexes, height, width, orientation } = this.state
    const style: any = {}
    if (cursor === 'move') {
      style.cursor = 'move'
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: y,
          left: x,
          ...style,
        }}
        onMouseDown={this.onMouseDown}
      >
        {cachedHexes && cachedHexes.filter(hex => {
          return (cursor === 'text') || hex.type !== 'hidden'
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
              zIndex: this.types[hex.type],
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