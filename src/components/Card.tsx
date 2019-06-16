import React from 'react'

import {
  Editor as CoreEditor, 
  Value,
} from 'slate'
import {
  Editor,
  RenderBlockProps,
} from 'slate-react'

import classNames from 'classnames'
import deepEquals from 'fast-deep-equal'
import { generateUUIDv4 } from '@bitjourney/uuid-v4'

import { CardData, ActionData, HexData } from './Data'
import { ActionEditor } from './ActionEditor'
import { Summon } from './Summon'
import { HexGrid } from './HexGrid'


export interface CardProps {
  cursor: 'move' | 'edit'
  onDataChange: (data: CardData) => void
  onCursorChange: (cursor: 'move' | 'edit') => void

  data: CardData
}

export interface CardState {
  mouse?: {
    type: 'action' | 'hex'
    key: string
    x: number
    y: number
  }
}

export class Card extends React.Component<CardProps, CardState> {
  titleEditor?: Editor

  constructor(props: CardProps) {
    super(props)

    this.state = {}
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
      this.props.onDataChange({
        ...this.props.data,
        hexes: {
          ...this.props.data.hexes,
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
      } else {
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
      }

      this.props.onDataChange({
        ...this.props.data,
        actions: {
          ...this.props.data.actions,
          [generateUUIDv4()]: {
            value: value,
            x: x,
            y: y
          },
        },
      })
    }
  }

  onTitleChange = ({value}) => {
    this.props.onDataChange({
      ...this.props.data,
      title: value,
    })
  }

  onLevelChange = ({value}) => {
    this.props.onDataChange({
      ...this.props.data,
      level: value,
    })
  }

  onInitiativeChange = ({value}) => {
    this.props.onDataChange({
      ...this.props.data,
      initiative: value,
    })
  }

  onSummonChange = (key, data) => {
    this.props.onDataChange({
      ...this.props.data,
      summon: {
        ...this.props.data.summon,
        [key]: data,
      },
    })
  }

  deleteAction = (key: string) => {
    const actions = {
      ...this.props.data.actions,
    }
    delete actions[key]

    this.props.onDataChange({
      ...this.props.data,
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

  onActionChange = (key: string, data: ActionData) => {
    this.props.onDataChange({
      ...this.props.data,
      actions: {
        ...this.props.data.actions,
        [key]: data,
      }
    })
  }

  deleteHex = (key: string) => {
    const hexes = {
      ...this.props.data.hexes,
    }
    delete hexes[key]

    this.props.onDataChange({
      ...this.props.data,
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

  onHexChange = (key: string, data: HexData) => {
    this.props.onDataChange({
      ...this.props.data,
      hexes: {
        ...this.props.data.hexes,
        [key]: data,
      }
    })
  }

  onMouseMove = (e: any) => {
    if (this.props.cursor !== 'move' || !this.state.mouse) return

    e.preventDefault()
    e.stopPropagation()

    const mouse = this.state.mouse
    if (mouse.type === 'action') {
      const actions = this.props.data.actions || {}
      this.props.onDataChange({
        ...this.props.data,
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
      const hexes = this.props.data.hexes || {}
      this.props.onDataChange({
        ...this.props.data,
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

  onClickSummonTop = (e: any) => {
    const { summon } = this.props.data
    const { top } = summon

    this.props.onDataChange({
      ...this.props.data,
      summon: {
        ...summon,
        top: {
          ...top,
          visible: !top.visible,
        },
      },
    })
  }

  onClickSummonBottom = (e: any) => {
    const { summon } = this.props.data
    const { bottom } = summon

    this.props.onDataChange({
      ...this.props.data,
      summon: {
        ...summon,
        bottom: {
          ...bottom,
          visible: !bottom.visible,
        },
      },
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || !deepEquals(this.state, nextState)
  }

  componentDidMount() {
    this.updateTitleColor()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      color,
      actions,
      hexes,
      title,
      level,
      initiative,
      summon,
    } = this.props.data

    this.props.onDataChange({
      color,
      actions,
      hexes,
      title,
      level,
      initiative,
      summon,
    })

    this.updateTitleColor()
  }

  updateTitleColor = () => {
    const { color } = this.props.data

    const editor = this.titleEditor
    if (!editor) return

    editor.value.document.getBlocks().forEach((block: any) => {
      if (!block)
        return
      else if (block.data.get('color') === color) 
        return

      editor.setNodeByKey(block.key, {
        type: 'card-title',
        data: {
          color: color,
        },
      })
    })
  }

  renderTitleBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
    const { attributes, children, node } = props

    if (node.type === 'card-title') {
      let style = {
        backgroundImage: `linear-gradient(${node.data.get('color')}80, white)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
      return <span {...attributes} style={style}>{children}</span>
    }
    return next()
  }

  titleRef = (editor: Editor) => {
    this.titleEditor = editor
  }

  render() {
    return (
      <div className='card'>
        <div>
          <img alt='card' className='center' src={require('../assets/card.jpg')}/>
          <img alt='card-runes' className='center runes' src={require('../assets/card-runes.jpg')}/>
          <div className='center color' style={{background: `${this.props.data.color}80`}}></div>
          <div className='actions' onDrop={this.onDrop} onDragOver={this.onDragOver} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
            <Editor
              className='title single-line'
              spellCheck={false}
              readOnly={this.props.cursor !== 'edit'}
              value={this.props.data.title}
              onChange={this.onTitleChange}
              renderBlock={this.renderTitleBlock}
              ref={this.titleRef}
            />
            <Editor
              className='level single-line'
              spellCheck={false}
              readOnly={this.props.cursor !== 'edit'}
              value={this.props.data.level}
              onChange={this.onLevelChange}
            />
            <Editor
              className='initiative single-line'
              spellCheck={false}
              readOnly={this.props.cursor !== 'edit'}
              value={this.props.data.initiative}
              onChange={this.onInitiativeChange}
            />

            {Object.entries(this.props.data.summon).map(([key, value]) => {
              return <Summon
                key={key}
                className={classNames({
                  'center': true,
                  'runes': true,
                  'summon': true,
                  [key]: true,
                })}
                onSummonChange={(data) =>
                  this.onSummonChange(key, data)
                }
                data={value}
              />
            })}

            {Object.entries(this.props.data.actions).map(([key, value]) => {
              return <ActionEditor
                key={key}
                cursor={this.props.cursor}
                deleteAction={() => {
                  this.deleteAction(key)
                }}
                onDragAction={(x: number, y: number) => {
                  this.onDragAction(key, x, y)
                }}
                onActionChange={(data) => {
                  this.onActionChange(key, data)
                }}
                data={value}
              />
            })}
            {Object.entries(this.props.data.hexes).map(([key, value]) => {
              return <HexGrid
                key={key}
                cursor={this.props.cursor}
                deleteHex={() => {
                  this.deleteHex(key)
                }}
                onDragHex={(x: number, y: number) => {
                  this.onDragHex(key, x, y)
                }}
                onHexChange={(data) => {
                  this.onHexChange(key, data)
                }}
                data={value}
              />
            })}
          </div>
        </div>
        <img
          src={require('../assets/summon1.png')}
          alt='summon top'
          className={classNames({
            "summon-toggle": true,
            "top": true,
            "disabled": !this.props.data.summon.top.visible,
          })}
          onClick={this.onClickSummonTop}
        />
        <img
          src={require('../assets/summon2.png')}
          alt='summon bottom'
          className={classNames({
            "summon-toggle": true,
            "bottom": true,
            "disabled": !this.props.data.summon.bottom.visible,
          })}
          onClick={this.onClickSummonBottom}
        />
      </div>
    )
  }
}
