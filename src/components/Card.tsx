import React from 'react'

import { Editor } from 'slate-react'
import { Value } from 'slate'
import Plain from 'slate-plain-serializer'

import { generateUUIDv4 } from '@bitjourney/uuid-v4'

import { ActionEditor, ActionContent } from './ActionEditor'
import { Summon } from './Summon'
import { HexGrid, HexState } from './HexGrid'


interface CardData {
  actions: {
    [key: string]: ActionContent,
  }
  hexes: {
    [key: string]: HexState,
  }
  title: Value
  level: Value
  initiative: Value
  summonTop: boolean
  summonBottom: boolean
}


export interface CardProps {
  color: string
  data?: CardData
  cursor: 'move' | 'text' | null
  onDataChange: (data: CardData) => void
  onCursorChange: (cursor: 'move' | 'text' | null) => void
}

export interface CardState extends CardData {
  mouse?: {
    type: 'action' | 'hex'
    key: string
    x: number
    y: number
  }
}

export class Card extends React.Component<CardProps, CardState> {
  editor?: Editor

  constructor(props: CardProps) {
    super(props)

    this.state = {
      actions: {},
      hexes: {},
      title: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [{
            object: 'block',
            type: 'action-main',
            nodes: [{
              object: 'text',
              text: 'Card Name',
              marks: [{
                type: 'card-title',
                data: {
                  color: props.color
                },
              }],
            }],
          }],
        },
      } as any),
      level: Plain.deserialize('1'),
      initiative: Plain.deserialize('00'),
      summonTop: false,
      summonBottom: false,
      ...(props.data || {}),
    }
  }

  onDragOver = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
  }

  onDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    const type = e.dataTransfer.getData('type')
    if (!type) return false

    const data = JSON.parse(e.dataTransfer.getData('extra') || '{}')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (type === 'hex') {
      this.setState({
        hexes: {
          ...this.state.hexes,
          [generateUUIDv4()]: {
            hexes: [],
            width: 30,
            height: 35,
            x: x,
            y: y,
            orientation: data.orientation,
          },
        },
      })
    } else {
      let value: Value
      if (type === 'text') {
        value = Value.fromJSON({
          object: 'value',
          document: {
            object: 'document',
            nodes: [{
              object: 'block',
              type: 'action-main',
              nodes: [{
                object: 'text',
                text: ' '
              }],
            }],
          },
        } as any)
      } else if (type === 'action' || type === 'element' || type === 'xp') {
        value = Value.fromJSON({
          object: 'value',
          document: {
            object: 'document',
            nodes: [{
              object: 'block',
              type: 'action-main',
              nodes: [{
                object: 'inline',
                ...data,
              }],
            }],
        },
        } as any)
      } else {
        return
      }

      this.setState({
        actions: {
          ...this.state.actions,
          [generateUUIDv4()]: {
            value: value,
            x: x,
            y: y
          },
        },
      })
    }

    this.props.onCursorChange('text')
  }

  onTitleChange = ({value}) => {
    this.setState({
      title: value,
    })
  }

  onLevelChange = ({value}) => {
    this.setState({
      level: value,
    })
  }

  onInitiativeChange = ({value}) => {
    this.setState({
      initiative: value,
    })
  }

  deleteAction = (key: string) => {
    const actions = {
      ...this.state.actions,
    }
    delete actions[key]

    this.setState({
      actions: {
        ...actions
      },
    })
  }

  onDragAction = (key: string, x: number, y: number) => {
    this.setState({
      mouse: {
        type: 'action',
        key: key,
        x: x,
        y: y,
      }
    })
  }

  deleteHex = (key: string) => {
    const hexes = {
      ...this.state.hexes,
    }
    delete hexes[key]

    this.setState({
      hexes: {
        ...hexes
      },
    })
  }

  onDragHex = (key: string, x: number, y: number) => {
    this.setState({
      mouse: {
        type: 'hex',
        key: key,
        x: x,
        y: y,
      }
    })
  }

  onMouseMove = (e: any) => {
    if (this.props.cursor !== 'move' || !this.state.mouse) return

    e.preventDefault()
    e.stopPropagation()

    const mouse = this.state.mouse
    if (mouse.type === 'action') {
      const { actions } = this.state
      this.setState({
        actions: {
          ...actions,
          [mouse.key]: {
            ...actions[mouse.key],
            x: e.clientX - mouse.x,
            y: e.clientY - mouse.y,
          }
        },
      })
    } else if (mouse.type === 'hex') {
      const { hexes } = this.state
      this.setState({
        hexes: {
          ...hexes,
          [mouse.key]: {
            ...hexes[mouse.key],
            x: e.clientX - mouse.x,
            y: e.clientY - mouse.y,
          }
        },
      })
    }
  }

  onMouseUp = (e: any) => {
    if (this.props.cursor !== 'move' || !this.state.mouse) return

    e.preventDefault()
    e.stopPropagation()

    this.setState({
      mouse: undefined,
    })
  }

  onToggleSummonTop = (e: any) => {
    this.setState({
      summonTop: !this.state.summonTop,
    })
  }

  onToggleSummonBottom = (e: any) => {
    this.setState({
      summonBottom: !this.state.summonBottom,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.props.onDataChange({
        actions: this.state.actions,
        hexes: this.state.hexes,
        title: this.state.title,
        level: this.state.level,
        initiative: this.state.initiative,
        summonTop: this.state.summonTop,
        summonBottom: this.state.summonBottom,
      })
    }

    if (prevProps.color === this.props.color) return

    const editor = this.editor as any
    editor.value.document.getTexts().forEach((text) => {
      text.marks.forEach((mark) => {
        if (mark.type !== 'card-title') return

        editor.setMarkByKey(text.key, 0, undefined, mark, {
          type: 'card-title',
          data: {
            color: this.props.color,
          },
        })
      })
    })
  }

  renderTitleMark = (props, editor, next) => {
    if (props.mark.type === 'card-title') {
      let style = {
        backgroundImage: `linear-gradient(${props.mark.data.get('color')}80, white)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
      return <span {...props.attributes} style={style}>{props.children}</span>
    }
    return next()
  }

  ref = (editor: any) => {
    this.editor = editor
  }

  render() {
    return (
      <div className='card'>
        <div>
          <img alt='card' className='center' src={require('../assets/card.jpg')}/>
          <img alt='card-runes' className='center runes' src={require('../assets/card-runes.jpg')}/>
          <div className='center color' style={{background: `${this.props.color}80`}}></div>
          <div className='actions' onDrop={this.onDrop} onDragOver={this.onDragOver} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
            <Editor
              className='title single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.title}
              onChange={this.onTitleChange}
              renderMark={this.renderTitleMark}
              ref={this.ref}
            />
            <Editor
              className='level single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.level}
              onChange={this.onLevelChange}
            />
            <Editor
              className='initiative single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.initiative}
              onChange={this.onInitiativeChange}
            />

            {this.state.summonTop && <Summon className='summon-top center runes'/>}
            {this.state.summonBottom && <Summon className='summon-bottom center runes'/>}

            {Object.entries(this.state.actions).map(([key, value]) => {
              return <ActionEditor
                key={key}
                cursor={this.props.cursor}
                deleteAction={() => {
                  this.deleteAction(key)
                }}
                onDragAction={(x: number, y: number) => {
                  this.onDragAction(key, x, y)
                }}
                {...value}
              />
            })}
            {Object.entries(this.state.hexes).map(([key, value]) => {
              return <HexGrid
                key={key}
                cursor={this.props.cursor}
                deleteHex={() => {
                  this.deleteHex(key)
                }}
                onDragHex={(x: number, y: number) => {
                  this.onDragHex(key, x, y)
                }}
                {...value}
              />
            })}
          </div>
        </div>
        <img
          src={require('../assets/summon1.png')}
          alt='summon top'
          className="summon-toggle top"
          style={{
            filter: this.state.summonTop ? undefined : 'grayscale()',
          }}
          onClick={this.onToggleSummonTop}
        />
        <img
          src={require('../assets/summon2.png')}
          alt='summon bottom'
          className="summon-toggle bottom"
          style={{
            filter: this.state.summonBottom ? undefined : 'grayscale()',
          }}
          onClick={this.onToggleSummonBottom}
        />
      </div>
    )
  }
}
