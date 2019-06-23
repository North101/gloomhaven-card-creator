import React from 'react'
import ReactDOM from 'react-dom'

import {
  Editor as CoreEditor,
  Inline,
} from 'slate'

import classNames from "classnames"


export const Button = React.forwardRef<React.Ref<any>, any>(({ className, active, reversed, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={classNames({
      'material-icons': true,
      'button': true,
      'active': active,
      'reversed': reversed,
      ...(className || {}),
    })}
  />
))

export const Icon = React.forwardRef<React.Ref<any>, any>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={classNames({
      'material-icons': true,
      'icon': true,
      ...(className || {}),
    })}
  />
))

export const Menu = React.forwardRef<React.Ref<any>, any>((props, ref) => (
  <div {...props} ref={ref} />
))

const FontSizeValueButton = ({ editor }) => {
  const { value } = editor
  const block = value.anchorBlock && value.anchorBlock.toJSON()
  if (!block) return null

  return (
    <span className="font-size">
      {block && block.data.fontSize ? block.data.fontSize : 18}pt
    </span>
  )
}

const FontSizeButton = ({ editor, type }) => {
  const { value } = editor
  const block = value.anchorBlock && value.anchorBlock.toJSON()
  if (!block) return null

  return (
    <Button
      reversed
      active
      onMouseDown={event => {
        event.preventDefault()

        editor.setBlocks({
          ...block,
          data: {
            ...block.data,
            fontSize: (block.data.fontSize || 18) + (type === 'add' ? 1 : -1),
          }
        })
      }}
    >
      <Icon>{`${type}_circle`}</Icon>
    </Button>
  )
}

const AlignButton = ({ editor, align }) => {
  const { value } = editor
  const block = value.anchorBlock && value.anchorBlock.toJSON()
  if (!block) return null

  const isActive = block.type === 'action-main' && (block.data.align || 'center') === align

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setBlocks({
          ...block,
          data: {
            ...block.data,
            align: align,
          },
        })
      }}
    >
      <Icon>{`format_align_${align}`}</Icon>
    </Button>
  )
}

const IconOnlyButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['action', 'element'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any
  const isActive = !inline.data.iconOnly

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            iconOnly: !inline.data.iconOnly,
          }
        })
      }}
    >
      <Icon>title</Icon>
    </Button>
  )
}

const ConsumeButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['element'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any
  const isActive = !inline.data.consume

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            consume: !inline.data.consume,
          }
        })
      }}
    >
      <img alt='consume' src={require('../assets/consume-element.png')} className='consume'/>
    </Button>
  )
}

const XPValueButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['xp', 'circle'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any

  return (
    <span className='xp-value'>
      {inline.data.value || 0}xp
    </span>
  )
}

const XPButton = ({ editor, type }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['xp', 'circle'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any

  return (
    <Button
      reversed
      active
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            value: (inline.data.value || 0) + (type === 'add' ? 1 : -1),
          }
        })
      }}
    >
      <Icon>{`${type}_circle`}</Icon>
    </Button>
  )
}

const XPSizeButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['xp'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any
  const isActive = inline.data.size !== 'small'

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            size: isActive ? 'small' : 'big',
          }
        })
      }}
    >
      <Icon>format_size</Icon>
    </Button>
  )
}

interface HoverMenuProps {
  editor: CoreEditor
}

export const HoverMenu = React.forwardRef<React.Ref<HTMLDivElement>, HoverMenuProps>((props, ref) => {
  const root = window.document.getElementById('root')
  if (!root) return null

  return ReactDOM.createPortal(
    <Menu ref={ref} className='hover-menu'>
      <div>
        <FontSizeButton editor={props.editor} type='remove' />
        <FontSizeValueButton editor={props.editor} />
        <FontSizeButton editor={props.editor} type='add' />
        <AlignButton editor={props.editor} align='left' />
        <AlignButton editor={props.editor} align='center' />
        <AlignButton editor={props.editor} align='right' />

        <span className="divider"/>

        <IconOnlyButton editor={props.editor} />
        <ConsumeButton editor={props.editor} />

        <XPButton editor={props.editor} type='remove' />
        <XPValueButton editor={props.editor} />
        <XPButton editor={props.editor} type='add' />
        <XPSizeButton editor={props.editor}/>
      </div>
    </Menu>,
    root
  )
})
