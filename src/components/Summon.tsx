import React from 'react'

import { Editor } from 'slate-react'

import deepEquals from 'fast-deep-equal'

import { SummonData } from './Data'
import { ActionPlugin } from './Actions'


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

export interface SummonProps {
  className: string
  onSummonChange: (data: SummonData) => any
  
  data: SummonData
}

export interface SummonState {}

export class Summon extends React.Component<SummonProps, SummonState> {
  onNameChange = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      name: value,
    })
  }

  onBox1Change = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      box1: value,
    })
  }

  onBox2Change = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      box2: value,
    })
  }

  onBox3Change = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      box3: value,
    })
  }

  onBox4Change = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      box4: value,
    })
  }

  onBox5Change = ({value}) => {
    this.props.onSummonChange({
      ...this.props.data,
      box5: value,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props.data, nextProps.data) || !deepEquals(this.state, nextState)
  }

  render() {
    const { data } = this.props
    if (!data.visible) return null

    return (
      <div className={this.props.className}>
        <img alt='summon' src={require('../assets/summon.png')}/>
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon name single-line'
          value={data.name}
          onChange={this.onNameChange}
        />
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon box1'
          value={data.box1}
          onChange={this.onBox1Change}
        />
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon box2'
          value={data.box2}
          onChange={this.onBox2Change}
        />
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon box3'
          value={data.box3}
          onChange={this.onBox3Change}
        />
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon box4'
          value={data.box4}
          onChange={this.onBox4Change}
        />
        <Editor
          schema={SCHEMA}
          plugins={PLUGINS}
          className='summon box5'
          value={data.box5}
          onChange={this.onBox5Change}
        />
      </div>
    )
  }
}
