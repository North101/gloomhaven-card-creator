import React from 'react'

import {
    Editor as CoreEditor,
    Value,
  } from 'slate'
import {
  Editor,
  EditorProps,
  RenderMarkProps,
} from 'slate-react'

import classNames from 'classnames'
import deepEquals from 'fast-deep-equal'

import { ActionData } from './Data'
import { ActionPlugin } from './Actions'
import { HoverMenu } from './HoverMenu'


const PLUGINS = [
  new ActionPlugin(),
]

const SCHEMA = {
  inlines: {
    action: {
      isVoid: true,
    },
    element: {
      isVoid: true,
    },
    xp: {
      isVoid: true,
    },
    circle: {
      isVoid: true,
    },
  },
}

export interface ActionEditorProps {
  cursor: 'move' | 'edit'
  deleteAction: () => void
  onDragAction: (x: number, y: number) => void
  onActionChange: (data: ActionData) => void

  data: ActionData
}

export interface ActionEditorState {}

export class ActionEditor extends React.Component<ActionEditorProps, ActionEditorState>  {
  editor?: Editor
  containerRef = React.createRef<HTMLDivElement>()
  menuRef = React.createRef<HTMLDivElement>()

  ref = (editor: Editor) => {
    this.editor = editor
  }

  updateMenu = () => {
    const containerRef = this.containerRef.current
    const menu = this.menuRef.current
    if (!containerRef || !menu) return

    const { selection } = this.props.data.value
    if (selection.isBlurred) {
      menu.style.top = null
      menu.style.left = null
      menu.style.opacity = null
      return
    }

    const rect = containerRef.getBoundingClientRect()
    menu.style.opacity = '1'
    menu.style.top = `${rect.top - menu.offsetHeight}px`
    menu.style.left = `${rect.left}px`
  }

  onBlur = (event: Event, editor: CoreEditor, next: () => any) => {
    const document = editor.value.document
    const text = document.text
    if (text !== '') return next()

    const blocks = document.getBlocks()
    if (blocks.size > 1) return next()

    const inlines = document.getInlines()
    if (inlines.size > 0) return next()

    this.props.deleteAction()
  }

  onMouseDown = (event: any) => {
    if (event.button !== 0 || this.props.cursor !== 'move') return

    event.preventDefault()
    event.stopPropagation()

    this.props.onDragAction(event.clientX - this.props.data.x, event.clientY - this.props.data.y)
  }

  onChange = (change: { value: Value }) => {
    this.props.onActionChange({
      ...this.props.data,
      value: change.value,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || !deepEquals(this.state, nextState)
  }

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()

    this.props.onActionChange(this.props.data)
  }

  render() {
    const { cursor } = this.props
    return (
      <div
        className={classNames({
          'action-editor': true,
          [cursor || '']: true,
        })}
        onMouseDown={this.onMouseDown}
        style={{
          top: this.props.data.y,
          left: this.props.data.x,
        }}
        ref={this.containerRef}
      >
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          autoFocus
          spellCheck={false}
          readOnly={this.props.cursor !== 'edit'}
          ref={this.ref}
          value={this.props.data.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  renderEditor = (props: EditorProps, editor: CoreEditor, next: () => any) => {
    const children = next()
    return (
      <React.Fragment>
        {children}
        <HoverMenu
          ref={this.menuRef as any}
          editor={editor}
        />
      </React.Fragment>
    )
  }

  renderMark = (props: RenderMarkProps, editor: CoreEditor, next: () => any) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }
}
