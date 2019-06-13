import React from 'react'

import { Inline } from 'slate'


export interface ActionProps {
  data: {
    text: string
    icon: any
    iconOnly?: boolean
    [key: string]: any
  }
  children?: any
}

export const Action: React.FC<ActionProps> = (props) => {
  const { data, children } = props

  return (
    <div className='action'>
      <span>{data.iconOnly ? '' : data.text}</span>
      {children && <span>{children}</span>}
      <img alt={data.text} src={require(`../assets/${data.icon}.png`)}/>
    </div>
  )
}

export const ElementAction: React.FC<ActionProps> = (props) => {
  const { data, children } = props

  return (
    <div className='action element'>
      <span>{data.iconOnly ? '' : data.text}</span>
      {children && <span>{children}</span>}
      <div>
        <img alt={data.text} src={require(`../assets/${data.icon}.png`)}/>
        {data.consume &&
          <img className='consume' alt='consume' src={require(`../assets/consume-element.png`)}/>
        }
      </div>
    </div>
  )
}

export const XPAction: React.FC<ActionProps> = (props) => {
  const { data, children } = props

  return (
    <div className={`action xp ${data.size}`}>
      <img alt='xp' src={require('../assets/xp.png')}/>
      <span>{children}</span>
    </div>
  )
}

export class ActionPlugin {
  renderInline = (props: any, editor: any, next: () => any) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'action':
        return <div className="inline-action" {...attributes}>
          <Action data={Object.fromEntries(node.data) as any}>
            {children}
          </Action>
        </div>
      case 'element':
        return <div className="inline-action" {...attributes}>
          <ElementAction data={Object.fromEntries(node.data) as any}>
            {children}
          </ElementAction>
        </div>
      case 'xp':
        return <div className="inline-action" {...attributes}>
          <XPAction data={Object.fromEntries(node.data) as any}>
            {children}
          </XPAction>
        </div>
      default:
        return next()
    }
  }

  onKeyDown = (event: any, editor: any, next: () => any) => {
    if (event.keyCode === 37) {
      const { document, selection } = editor.value
      const { start } = selection

      if (start.offset !== 0) return next()
      
      let node = document.getPreviousNode(start.key)
      if (!Inline.isInline(node) || (node.type !== 'action' && node.type !== 'element')) return next()

      let text = document.getPreviousText(node.key)
      while (text && node.hasDescendant(text.key)) {
        text = document.getPreviousText(text.key)
      }
      if (!text) return next()

      event.preventDefault()
      event.stopPropagation()
      editor.moveToEndOfNode(text).focus()
    } else if (event.keyCode === 37) {
      const { document, selection } = editor.value
      const { start } = selection
      
      let node = document.getNextNode(start.key)
      if (!Inline.isInline(node) || (node.type !== 'action' && node.type !== 'element')) return next()
      
      event.preventDefault()
      event.stopPropagation()

      let text = document.getNextText(node.key)
      while (text && node.hasDescendant(text.key)) {
        text = document.getNextText(text.key)
      }
      if (!text) return next()

      event.preventDefault()
      event.stopPropagation()
      editor.moveToStartOfNode(text).focus()
    }
    return next()
  }

  onClick = (event: any, editor: any, next: () => any) => {
    const node = editor.findNode(event.target)
    if (Inline.isInline(node) && node.type === 'action') {
      event.preventDefault()
      event.stopPropagation()

      const { document } = editor.value

      const target = editor.findDOMNode(editor.value.document.getPath(node.key))
      const rect = target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const width = target.clientWidth
      if (x > (width / 2)) {
        let text = document.getNextText(node.key)
        while (text && node.hasDescendant(text.key)) {
          text = document.getNextText(text.key)
        }
        if (text) {
          editor.moveToStartOfNode(text).focus()
        }
      } else {
        let text = document.getPreviousText(node.key)
        while (text && node.hasDescendant(text.key)) {
          text = document.getPreviousText(text.key)
        }
        if (text) {
          editor.moveToEndOfNode(text).focus()
        }
      }
    } else if (Inline.isInline(node) && node.type === 'element') {
      event.preventDefault()
      event.stopPropagation()

      const inline = node.toJSON()
      const data = inline.data || {}

      editor.replaceNodeByKey(node.key, {
        ...inline,
        data: {
          ...data,
          consume: !data.consume,
        },
      })
    } else {
      return next()
    }
  }

  onDragOver = (event: any, editor: any, next: () => any) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop = (event: any, editor: any, next: () => any) => {
    event.preventDefault()
    event.stopPropagation()

    const type = event.dataTransfer.getData('type')
    if (!type) return next()

    const data = JSON.parse(event.dataTransfer.getData('extra')) || {}
    if (type === 'text') {
      editor.insertText('')
    } else if (type !== 'hex') {
      editor.insertInline({
        object: 'inline',
        ...data,
      })
    }
  }

  onChange = (editor: any, next: () => any) => {
    const { value } = editor
    const xpActions = value.document.getInlinesByType('xp')
    const isSmall = value.document.getBlocks().some((value) => {
      return value.nodes.some((v1) => {
        if (v1.object === 'inline' && v1.type === 'xp')
          return false
        else if (v1.object === 'text' && v1.text === '')
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
      const value = action.toJSON()
      value.data = value.data || {}
      if (value.data.size !== size) {
        value.data.size = size
        editor.replaceNodeByKey(action.key, value)
      }
    })

    return next()
  }
}