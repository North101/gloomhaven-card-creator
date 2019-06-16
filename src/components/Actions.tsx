import React from 'react'

import classNames from 'classnames'

import {
  Editor as CoreEditor,
  Plugin,
  Inline,
} from 'slate'

import {
  RenderBlockProps,
  RenderInlineProps,
} from 'slate-react'


export interface ActionProps {
  node: Inline
  children?: any
}

export const Action: React.FC<ActionProps> = (props) => {
  const { node, children } = props
  const { data } = node

  return (
    <div className='action'>
      <span>{data.get('iconOnly') ? '' : data.get('text')}</span>
      {children ? children : <span></span>}
      <img alt={data.get('text')} src={require(`../assets/${data.get('icon')}.png`)}/>
    </div>
  )
}

export const ElementAction: React.FC<ActionProps> = (props) => {
  const { node, children } = props
  const { data } = node

  return (
    <div className='action element'>
      <span>{data.get('iconOnly') ? '' : data.get('text')}</span>
      {children ? children : <span></span>}
      <div>
        <img alt={data.get('text')} src={require(`../assets/${data.get('icon')}.png`)}/>
        {data.get('consume') &&
          <img className='consume' alt='consume' src={require(`../assets/consume-element.png`)}/>
        }
      </div>
    </div>
  )
}

export const XPAction: React.FC<ActionProps> = (props) => {
  const { node, children } = props
  const { data } = node

  return (
    <div className={`action xp ${data.size}`}>
      <img alt='xp' src={require('../assets/xp.png')}/>
      <span>{data.get('value') || 0}</span>
      {children ? children : <span></span>}
    </div>
  )
}

export const CircleAction: React.FC<ActionProps> = (props) => {
  const { node, children } = props
  const { data } = node
  const value = data.get('value')
  const icon = value ? 'circle-xp' : 'circle'

  return (
    <div className='action circle'>
      <img alt='circle' src={require(`../assets/${icon}.png`)}/>
      <span>{value ? value : ''}</span>
      {children ? children : <span></span>}
    </div>
  )
}

export class ActionPlugin implements Plugin {
  renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'action-main': {
        const { className, styles, ...attrs } = attributes
        const fontSize = node.data.get('fontSize') || 18
        const align = node.data.get('align') || 'center'

        return <div
          {...attrs}
          className={classNames({
            "action-main": true,
            [align]: true,
            ...(className || {}),
          })}
          style={{
            ...(styles || {}),
            fontSize: `${fontSize}pt`,
          }}
        >
          {children}
        </div>
      }
      default:
        return next()
    }
  }

  renderInline = (props: RenderInlineProps, editor: CoreEditor, next: () => any) => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'action':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <Action node={node}/>
        </div>
      case 'element':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <ElementAction node={node}/>
        </div>
      case 'xp':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <XPAction node={node}>
            {children}
          </XPAction>
        </div>
      case 'circle':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <CircleAction node={node}>
            {children}
          </CircleAction>
        </div>
      default:
        return next()
    }
  }

  onDragOver = (event: any, editor: CoreEditor, next: () => any) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop = (event: any, editor: CoreEditor, next: () => any) => {
    event.preventDefault()
    event.stopPropagation()

    const { dataTransfer } = event
    if (!dataTransfer) return

    const type = dataTransfer.getData('type')
    if (!type) return next()

    const data = JSON.parse(dataTransfer.getData('extra')) || {}
    if (type === 'edit') {
      editor.insertText('')
    } else if (type !== 'hex') {
      editor.insertInline({
        object: 'inline',
        ...data,
      })
    }
  }

  onChange = (editor: CoreEditor, next: () => any) => {
    const { value } = editor
    if (!value) return

    const xpActions = value.document.getInlinesByType('xp')
    const isSmall = value.document.getBlocks().some(block => {
      if (!block) return false

      return block.nodes.some((node) => {
        if (!node)
          return true
        else if (node.object === 'inline' && node.type === 'xp')
          return false
        else if (node.object === 'text' && node.text === '')
          return false
        else
          return true
      })
    })

    let size
    if (!isSmall && xpActions.size === 1 && value.document.nodes.size === 1) {
      size = 'big'
    } else {
       size = 'small'
    }
    xpActions.forEach((action) => {
      if (!action) return

      const actionJSON = action.toJSON()
      actionJSON.data = actionJSON.data || {}
      if (actionJSON.data.size !== size) {
        actionJSON.data.size = size
        editor.replaceNodeByKey(action.key, Inline.fromJSON(actionJSON))
      }
    })

    return next()
  }
}
