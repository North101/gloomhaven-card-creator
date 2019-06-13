import React from 'react'

import { Editor } from 'slate-react'
import { Value, Inline } from 'slate'

import { renderActions } from './Actions'
import { HoverMenu } from './HoverMenu'


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
      menu.style.opacity = 0
      return
    }

    const rect = containerRef.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top - menu.offsetHeight}px`
    menu.style.left = `${rect.left}px`
  }

  onKeyDown = (event: any, editor, next) => {
    if (event.key === 'Enter') {
      if (event.shiftKey === false) {
        return editor.insertBlock({
          type: 'action-main'
        })
      } else {
        return editor.insertBlock({
          type: 'action-modifier'
        })
      }
    }
    return next()
  }

  onChange = ({ value }) => {
    const editor = this.editor
    if (!editor) return

    this.setState({ value })

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

  onDragOver = (event: any, editor: any, next: any) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop = (event: any, editor: any, next: any) => {
    event.preventDefault()
    event.stopPropagation()

    const action = event.dataTransfer.getData('action')
    if (!action) return next()

    const data = JSON.parse(event.dataTransfer.getData('data')) || {}
    if (action === 'text') {
      editor.insertText('')
    } else {
      editor.insertInline({
        ...data,
        object: 'inline',
        type: action,
      })
    }
  }

  onClick = (event: any, editor: any, next: any) => {
    const node = editor.findNode(event.target)
    if (!Inline.isInline(node) || !node.type.startsWith('element-')) return next()

    const json = node.toJSON()
    const jsonData = json.data || {}

    editor.replaceNodeByKey(node.key, {
      ...json,
      data: {
        ...jsonData,
        consume: !jsonData.consume,
      },
    })

    return next()
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
          autoFocus
          spellCheck={false}
          readOnly={this.props.cursor !== 'text'}
          ref={this.ref}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
          onClick={this.onClick}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
          renderBlock={this.renderBlock}
          renderInline={renderActions}
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
            justifyContent: align
          }}
        >
          {children}
        </div>
      }
      default:
        return next()
    }
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
