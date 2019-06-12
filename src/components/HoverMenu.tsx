import { Editor } from 'slate-react'

import React from 'react'
import ReactDOM from 'react-dom'


export const Button = React.forwardRef<React.Ref<any>, any>(({ style, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      style={{
        ...style,
        cursor: 'pointer',
        color: `${reversed ? active ? 'white' : '#aaa' : active ? 'black' : '#ccc'}`,
      }}
    />
  )
)

export const Icon = React.forwardRef<React.Ref<any>, any>(({ className, style, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={[
      ...(className || '').split(' '),
      'material-icons',
    ].join(' ')}
    style={{
      ...style,
      fontSize: '18px',
      verticalAlign: 'text-bottom',
    }}
  />
))

export const Menu = React.forwardRef<React.Ref<any>, any>((props, ref) => (
  <div
    {...props}
    ref={ref}
  />
))

const FontSizeValueButton = ({ editor }) => {
  const block = editor.value.anchorBlock
  const blockData = (block && block.data) || new Map<string, any>()

  return (
    <span style={{color: 'white', padding: '0 4px', textAlign: 'center', minWidth: '2ems'}}>
      {blockData.get('fontSize') || 18}pt
    </span>
  )
}

const FontSizeButton = ({ editor, type }) => {
  const { value } = editor
  const block = value.anchorBlock && (value.anchorBlock.toJSON() || {})
  const isActive = block && block.type === 'action-main'

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
  const block = value.anchorBlock && (value.anchorBlock.toJSON() || {})
  const isActive = block && block.type === 'action-main' && (block.data.align || 'center') === align

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
          }
        })
      }}
    >
      <Icon>{`format_align_${align}`}</Icon>
    </Button>
  )
}

export const HoverMenu = React.forwardRef<React.Ref<any>, {editor: Editor}>((props, ref) => {
  const root = window.document.getElementById('root')
  if (!root) return null

  return ReactDOM.createPortal(
    <Menu
      ref={ref}
      style={{
        padding: '8px 7px 6px',
        position: 'absolute',
        zIndex: '1',
        top: '-10000px',
        left: '-10000px',
        marginTop: '-6px',
        opacity: '0',
        backgroundColor: '#222',
        borderRadius: '4px',
        transition: 'opacity 0.75s',
      }}
    >
      <FontSizeButton editor={props.editor} type='remove' />
      <FontSizeValueButton editor={props.editor} />
      <FontSizeButton editor={props.editor} type='add' />
      <AlignButton editor={props.editor} align='left' />
      <AlignButton editor={props.editor} align='center' />
      <AlignButton editor={props.editor} align='right' />
    </Menu>,
    root
  )
})
