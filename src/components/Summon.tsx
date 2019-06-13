import React from 'react'

import { Editor } from 'slate-react'
import { Value } from 'slate'
import Plain from 'slate-plain-serializer'

import { ActionPlugin } from './Actions'


const PLUGINS = [
  new ActionPlugin(),
] as any


export interface SummonProps {
  className: string
}

export interface SummonState {
  name: Value
  box1: Value
  box2: Value
  box3: Value
  box4: Value
  box5: Value
}

export class Summon extends React.Component<SummonProps, SummonState> {
  constructor(props: SummonProps) {
    super(props)

    this.state = {
      name: Plain.deserialize('Summon '),
      box1: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'inline',
                  type: 'action',
                  data: {
                    icon: 'heal',
                    iconOnly: true,
                  }
                },
                {
                  object: 'text',
                  text: ': 4'
                }
              ]
            }
          ]
        }
      } as any),
      box2: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'inline',
                  type: 'action',
                  data: {
                    icon: 'attack',
                    iconOnly: true,
                  }
                },
                {
                  object: 'text',
                  text: ': 3'
                }
              ]
            }
          ]
        }
      } as any),
      box3: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'inline',
                  type: 'action',
                  data: {
                    icon: 'move',
                    iconOnly: true,
                  }
                },
                {
                  object: 'text',
                  text: ': 3'
                }
              ]
            }
          ]
        }
      } as any),
      box4: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'inline',
                  type: 'action',
                  data: {
                    icon: 'range',
                    iconOnly: true,
                  }
                },
                {
                  object: 'text',
                  text: ': -'
                }
              ]
            }
          ]
        }
      } as any),
      box5: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
            }
          ]
        }
      } as any),
    }
  }

  onNameChange = ({value}) => {
    this.setState({
      name: value,
    })
  }

  onBox1Change = ({value}) => {
    this.setState({
      box1: value,
    })
  }

  onBox2Change = ({value}) => {
    this.setState({
      box2: value,
    })
  }

  onBox3Change = ({value}) => {
    this.setState({
      box3: value,
    })
  }

  onBox4Change = ({value}) => {
    this.setState({
      box4: value,
    })
  }

  onBox5Change = ({value}) => {
    this.setState({
      box5: value,
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        <img alt='summon' src={require('../assets/summon.png')}/>
        <Editor
          plugins={PLUGINS}
          className='summon name single-line'
          value={this.state.name}
          onChange={this.onNameChange}
        />
        <Editor
          plugins={PLUGINS}
          className='summon box1'
          value={this.state.box1}
          onChange={this.onBox1Change}
        />
        <Editor
          plugins={PLUGINS}
          className='summon box2'
          value={this.state.box2}
          onChange={this.onBox2Change}
        />
        <Editor
          plugins={PLUGINS}
          className='summon box3'
          value={this.state.box3}
          onChange={this.onBox3Change}
        />
        <Editor
          plugins={PLUGINS}
          className='summon box4'
          value={this.state.box4}
          onChange={this.onBox4Change}
        />
        <Editor
          plugins={PLUGINS}
          className='summon box5'
          value={this.state.box5}
          onChange={this.onBox5Change}
        />
      </div>
    )
  }
}
