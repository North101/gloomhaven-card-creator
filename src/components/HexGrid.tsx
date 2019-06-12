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

  hexes: Hex[],
  height: number
  width: number
  x: number
  y: number
}

export interface HexState {
  hexes: Hex[]
  height: number
  width: number
  x: number
  y: number
}

export class HexGrid extends React.Component<HexProps, HexState> {
  constructor(props: HexProps) {
    super(props)

    this.state = {
      hexes: props.hexes,
      height: props.height,
      width: props.width,
      x: props.x,
      y: props.y,
    }
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
    })
  }

  onMouseDown = (e: any) => {
    if (e.button !== 0 || this.props.cursor !== 'move') return

    e.preventDefault()
    e.stopPropagation()

    this.props.onDragHex(e.clientX - this.props.x, e.clientY - this.props.y)
  }

  render() {
    const { hexes, height, width } = this.state
    const types = {
      'hidden': 0,
      'enemy': 1,
      'player': 2,
    }
    const style: any = {}
    if (this.props.cursor === 'move') {
      style.cursor = 'move'
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: this.props.y,
          left: this.props.x,
          ...style,
        }}
        onMouseDown={this.onMouseDown}
      >
        {hexes.flatMap((hex) => {
          if (this.props.cursor === 'move') {
            return [
              hex
            ]
          } else {
            const rowOffset = Math.abs(hex.row % 2) === 1 ? 0 : -1
            return [
              {
                row: hex.row - 1,
                column: hex.column + rowOffset,
                type: 'hidden',
              },
              {
                row: hex.row - 1,
                column: hex.column + 1 + rowOffset,
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
                column: hex.column + rowOffset,
                type: 'hidden',
              },
              {
                row: hex.row + 1,
                column: hex.column + 1 + rowOffset,
                type: 'hidden',
              },
            ] as Hex[]
          }
        }).filter((hex, index, array) => {
          // filter out duplicates
          return !array.some((otherHex, otherIndex) => {
            return otherHex !== hex &&
              otherHex.column === hex.column &&
              otherHex.row === hex.row &&
              (
                types[hex.type] < types[otherHex.type] ||
                (hex.type === otherHex.type && index > otherIndex)
              )
          })
        }).map((hex, index) => {
          const rowOffset = Math.abs(hex.row % 2) === 1 ? width / 2 : 0
          return <img
            key={index}
            alt={`hex_${hex.column}_${hex.row}`}
            src={require(`../assets/hex-${hex.type}.small.png`)}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              position: 'absolute',
              top: `${(hex.row * height * 3 / 4)}px`,
              left: `${(hex.column * width) + rowOffset}px`,
              zIndex: types[hex.type]
            }}
            onClick={(e) => this.onClick(e, hex)}
          />
        })}
      </div>
    )
  }
}