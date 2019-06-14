import React from 'react'

import { Editor } from 'slate-react'
import { Value } from 'slate'

import { ActionPlugin } from './Actions'
import { HoverMenu } from './HoverMenu'


const PLUGINS = [
  new ActionPlugin(),
] as any

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
    }
  },
}


export interface ActionContent {
  value: Value
  x: number
  y: number
}

export interface ActionEditorProps extends ActionContent {
  cursor: 'move' | 'text' | null
  deleteAction: () => void
  onDragAction: (x: number, y: number) => void
}

export interface ActionEditorState extends ActionContent {}

export class ActionEditor extends React.Component<ActionEditorProps, ActionEditorState>  {
  editor?: Editor
  containerRef = React.createRef<HTMLDivElement>()
  menuRef = React.createRef<HTMLDivElement>()

  constructor(props: ActionEditorProps) {
    super(props)

    this.state = {
      ...props,
    }
  }

  ref = (editor: any) => {
    this.editor = editor
  }

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  updateMenu = () => {
    const containerRef: any = this.containerRef.current
    const menu: any = this.menuRef.current
    if (!containerRef || !menu) return

    const { selection } = this.state.value
    if (selection.isBlurred) {
      menu.style.top = null
      menu.style.left = null
      menu.style.opacity = null
      return
    }

    const rect = containerRef.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top - menu.offsetHeight}px`
    menu.style.left = `${rect.left}px`
  }

  onBlur = (event: any, editor, next) => {
    const document = editor.value.document
    const text = document.text
    if (text !== '') return next()

    const blocks = document.getBlocks()
    if (blocks.size > 1) return next()

    const inlines = document.getInlines()
    if (inlines.size > 0) return next()

    this.props.deleteAction()
  }

  onMouseDown = (e: any) => {
    if (e.button !== 0 || this.props.cursor !== 'move') return

    e.preventDefault()
    e.stopPropagation()

    this.props.onDragAction(e.clientX - this.props.x, e.clientY - this.props.y)
  }

  onChange = ({ value }) => {
    this.setState({
      value,
    })
  }

  render() {
    const style: any = {}
    if (this.props.cursor === 'move') {
      style.cursor = 'move'
    }
    return (
      <div
        className='action-editor'
        onMouseDown={this.onMouseDown}
        style={{
          top: this.props.y,
          left: this.props.x,
          ...style,
        }}
        ref={this.containerRef}
      >
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          autoFocus
          spellCheck={false}
          readOnly={this.props.cursor !== 'text'}
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  renderEditor = (props, editor, next) => {
    const children = next()
    return (
      <React.Fragment>
        {children}
        <HoverMenu ref={this.menuRef as any} editor={editor as any} />
      </React.Fragment>
    )
  }

  renderMark = (props: any, editor: any, next: () => any) => {
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
