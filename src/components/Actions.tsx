import React from 'react'


export interface ActionProps {
  data: {
    text: string
    icon: any
    iconOnly?: boolean
    [key: string]: any
  }
  node: any
  children?: any
}

export const Action: React.FC<ActionProps> = (props) => {
  const { data, children } = props

  return (
    <div className='action'>
      <span>{data.iconOnly ? '' : data.text}</span>
      {children ? children : <span></span>}
      <img alt={data.text} src={require(`../assets/${data.icon}.png`)}/>
    </div>
  )
}

export const ElementAction: React.FC<ActionProps> = (props) => {
  const { data, children } = props

  return (
    <div className='action element'>
      <span>{data.iconOnly ? '' : data.text}</span>
      {children ? children : <span></span>}
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
      <span>{data.value}</span>
      {children ? children : <span></span>}
    </div>
  )
}

export const CircleAction: React.FC<ActionProps> = (props) => {
  const { data, children, node } = props
  let icon
  if (typeof(node.value) === 'number') {
    icon = 'circle-xp'
  } else {
    icon = 'circle'
  }

  return (
    <div className='action circle'>
      <img alt='circle' src={require(`../assets/${icon}.png`)}/>
      <span>{data.value}</span>
      {children ? children : <span></span>}
    </div>
  )
}

export class ActionPlugin {
  renderBlock = (props: any, editor: any, next: () => any) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'action-main': {
        const { styles, ...attrs } = attributes
        const fontSize = node.data.get('fontSize') || 18
        const align = {
          left: 'flex-start',
          right: 'flex-end',
        }[node.data.get('align')] || 'center'

        return <div
          className="action-main"
          {...attrs}
          style={{
            ...(styles || {}),
            fontSize: `${fontSize}pt`,
            justifyContent: align,
          }}
        >
          {children}
        </div>
      }
      default:
        return next()
    }
  }

  renderInline = (props: any, editor: any, next: () => any) => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'action':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <Action node={node} data={Object.fromEntries(node.data) as any}/>
        </div>
      case 'element':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <ElementAction node={node} data={Object.fromEntries(node.data) as any}/>
        </div>
      case 'xp':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <XPAction node={node} data={Object.fromEntries(node.data) as any}>
            {children}
          </XPAction>
        </div>
      case 'circle':
        return <div contentEditable={false} className={`inline-action ${isFocused ? 'focused' : ''}`} {...attributes}>
          <CircleAction node={node} data={Object.fromEntries(node.data) as any}>
            {children}
          </CircleAction>
        </div>
      default:
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
