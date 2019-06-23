import React from 'react'

import { throttle } from 'throttle-debounce'


export interface ToolbarProps {
  color: string
  onColorChange: (color: string) => void
  onCursorChange: (cursor: 'move' | 'edit') => void
  onPrintClick: () => void
  onDeleteClick: () => void
}

export interface ToolbarState {
  color: string
}

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props)

    this.state = {
      color: props.color,
    }
  }
  onColorChange = (e: any) => {
    const { value } = e.target
    this.setState({
      color: value,
    })
    this.onThrottledColorChange(value)
  }

  onThrottledColorChange = throttle(100, (color: string) => {
    this.props.onColorChange(color)
  })

  onCursorChange = (e: any, cursor: 'move' | 'edit') => {
    e.preventDefault()
    e.stopPropagation()

    this.props.onCursorChange(cursor)
  }

  onDragStart = (e: any) => {
    e.dataTransfer.setData('type', 'text')
    e.dataTransfer.setData('extra', JSON.stringify({}))
    e.dataTransfer.dropEffect = 'copy'
  }

  onPrintClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.onPrintClick()
  }

  onMoveClick = (e: any) => {
    this.onCursorChange(e, 'move')
  }

  onTextClick = (e: any) => {
    this.onCursorChange(e, 'edit')
  }

  onDeleteClick = (e: any) => {
    this.props.onDeleteClick()
  }

  render() {
    return (
      <div className='toolbar-container'>
        <div className='toolbar main'>
          <div><input type='color' value={this.state.color} onChange={this.onColorChange}/></div>
          
          <div className='material-icons md-light click' onClick={this.onPrintClick}>print</div>
          <div className='material-icons md-light click' onClick={this.onMoveClick}>zoom_out_map</div>
        </div>

        <span className="divider"/>
        
        <div className='toolbar'>
          <div className='material-icons md-light' draggable onDragStart={this.onDragStart} onClick={this.onTextClick}>edit</div>

          <ToolbarIcon type='hex' icon='hex-enemy-vertical' orientation='vertical' />
          <ToolbarIcon type='hex' icon='hex-enemy-horizontal' orientation='horizontal' />
          
          <ToolbarIcon type='action' icon='attack' text='Attack' />
          <ToolbarIcon type='action' icon='heal' text='Heal' />
          <ToolbarIcon type='action' icon='range' text='Range' />
          <ToolbarIcon type='action' icon='target' text='Target' />
          <ToolbarIcon type='action' icon='move' text='Move' />
          <ToolbarIcon type='action' icon='jump' text='Jump' />
          <ToolbarIcon type='action' icon='flying' text='Flying' />
          <ToolbarIcon type='action' icon='shield' text='Shield' />
          <ToolbarIcon type='action' icon='retaliate' text='Retaliate' />
          <ToolbarIcon type='action' icon='loot' text='Loot' />
          <ToolbarIcon type='xp' icon='xp' text='XP' />
          <ToolbarIcon type='action' icon='round' text='Round' iconOnly={true} />
          <ToolbarIcon type='action' icon='persistent' text='Persistent' iconOnly={true} />

          <ToolbarIcon type='element' icon='element-all' text='All' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-fire' text='Fire' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-ice' text='Ice' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-air' text='Air' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-earth' text='Earth' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-light' text='Light' iconOnly={true} />
          <ToolbarIcon type='element' icon='element-dark' text='Dark' iconOnly={true} />

          <ToolbarIcon type='action' icon='effect-add-target' text='ADD TARGET' />
          <ToolbarIcon type='action' icon='effect-push' text='PUSH' />
          <ToolbarIcon type='action' icon='effect-pull' text='PULL' />
          <ToolbarIcon type='action' icon='effect-pierce' text='PIERCE' />

          <ToolbarIcon type='action' icon='status-poison' text='POISON' />
          <ToolbarIcon type='action' icon='status-wound' text='WOUND' />
          <ToolbarIcon type='action' icon='status-immobilize' text='IMMOBILIZE' />
          <ToolbarIcon type='action' icon='status-disarm' text='DISARM' />
          <ToolbarIcon type='action' icon='status-stun' text='STUN' />
          <ToolbarIcon type='action' icon='status-muddle' text='MUDDLE' />
          <ToolbarIcon type='action' icon='curse' text='CURSE' />

          <ToolbarIcon type='action' icon='status-invisible' text='INVISIBLE' />
          <ToolbarIcon type='action' icon='status-strengthen' text='STRENGTHEN' />
          <ToolbarIcon type='action' icon='bless' text='BLESS' />

          <ToolbarIcon type='action' icon='card-lost' text='card-lost' iconOnly={true} />
          <ToolbarIcon type='action' icon='card-recover' text='card-recover' iconOnly={true} />
          <ToolbarIcon type='action' icon='card-unrecoverable' text='card-unrecoverable' iconOnly={true} />

          <ToolbarIcon type='action' icon='item-head' text='Head' iconOnly={true} />
          <ToolbarIcon type='action' icon='item-body' text='Body' iconOnly={true} />
          <ToolbarIcon type='action' icon='item-feet' text='Feet' iconOnly={true} />
          <ToolbarIcon type='action' icon='item-onehand' text='One Hand' iconOnly={true} />
          <ToolbarIcon type='action' icon='item-twohands' text='Two Hands' iconOnly={true} />
          <ToolbarIcon type='action' icon='item-small' text='Small' iconOnly={true} />

          <ToolbarIcon type='action' icon='item-spent' text='Spent' />
          <ToolbarIcon type='action' icon='item-refresh' text='Refresh' />

          <ToolbarIcon type='circle' icon='circle' text='Circle' iconOnly={true} />

          <ToolbarIcon type='action' icon='enhancement' text='Enhancement' iconOnly={true} />
        </div>

        <span className="divider"/>

        <div className='toolbar main'>
          <div className='material-icons md-light click' onClick={this.onDeleteClick}>delete</div>
        </div>
      </div>
    )
  }
}

export interface ToolbarIconAction {
  type: 'action' | 'element' | 'xp' | 'circle' | 'edit'
  nodes?: any
  icon: string
  iconOnly?: boolean
  text: string
}

export interface ToolbarIconHex {
  type: 'hex'
  nodes?: any
  icon: string
  orientation: 'vertical' | 'horizontal'
}

export type ToolbarIconProps = ToolbarIconAction | ToolbarIconHex

export const ToolbarIcon: React.FC<ToolbarIconProps> = (props) => {
  let onDragStart = (e: any) => {
    const { type } = props
    let extra

    if (type === 'hex') {
      extra = props
    } else {
      const { type, nodes, ...data } = props
      extra = {
        type,
        nodes,
        data,
      }
    }

    e.dataTransfer.setData('type', type)
    e.dataTransfer.setData('extra', JSON.stringify(extra))
    e.dataTransfer.dropEffect = 'copy'
  }

  return (
    <div draggable onDragStart={onDragStart}>
      <img alt={props.icon} src={require(`../assets/${props.icon}.png`)}/>
    </div>
  )
}
