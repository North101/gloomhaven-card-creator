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

const BlockTypeButton = ({ editor }) => {
  const { value } = editor;
  const isActive = value.anchorBlock && value.anchorBlock.type === 'action-main';
  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()
        editor.setBlocks(isActive ? 'action-modifier' : 'action-main');
      }}
    >
      <Icon>format_size</Icon>
    </Button>
  )
}

export const HoverMenu = React.forwardRef<React.Ref<any>, {editor: Editor}>((props, ref) => {
  const root = window.document.getElementById('root');
  if (!root) return null;

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
      <BlockTypeButton editor={props.editor} />
    </Menu>,
    root
  )
})
