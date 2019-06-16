import React from 'react'

import {
  Value,
} from 'slate'
import Plain from 'slate-plain-serializer'

import deepEquals from 'fast-deep-equal'
import * as ls from 'local-storage'

import './App.css'
import {
  CardData,
  CardJSON,
} from './components/Data'
import { Card } from './components/Card'
import { Toolbar } from './components/Toolbar'


const summonData = {
  visible: false,
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

interface AppProps {}

interface AppState extends CardData {
  cursor: 'move' | 'edit'
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.state = {
      cursor: 'edit',
      color: "#ff0000",
      ...this.getInitialState(),
    }
  }

  getInitialState = () => {
    return {
      actions: {},
      hexes: {},
      title: Plain.deserialize('Card Name'),
      level: Plain.deserialize('1'),
      initiative: Plain.deserialize('00'),
      summon: {
        top: summonData,
        bottom: summonData,
      }
    }
  }

  onColorChange = (color: string) => {
    this.setState({
      color: color,
    })
  }

  onCursorChange = (cursor: 'move' | 'edit') => {
    this.setState({
      cursor: cursor,
    })
  }

  onDataChange = (data: CardData) => {
    this.setState({
      ...data,
    })
  }

  onPrintClick = () => {
    this.setState({
      cursor: 'move',
    }, () => {
      window.print()
    })
  }

  onDeleteClick = () => {
    this.setState(this.getInitialState())
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.state, nextState)
  }

  componentDidMount() {
    const data = ls.get<CardJSON>('data')
    if (data) {
      const { color, actions, hexes, title, level, initiative, summon } = data
      this.setState({
        color,
        actions: Object.fromEntries(Object.entries(actions).map(([key, value]) => {
          return [key, {
            value: Value.fromJSON(value.value),
            x: value.x,
            y: value.y,
          }]
        })),
        hexes,
        title: Plain.deserialize(title),
        level: Plain.deserialize(level),
        initiative: Plain.deserialize(initiative),
        summon: {
          top: {
            visible: summon.top.visible,
            name: Plain.deserialize(summon.top.name),
            box1: Value.fromJSON(summon.top.box1),
            box2: Value.fromJSON(summon.top.box2),
            box3: Value.fromJSON(summon.top.box3),
            box4: Value.fromJSON(summon.top.box4),
            box5: Value.fromJSON(summon.top.box5),
          },
          bottom: {
            visible: summon.bottom.visible,
            name: Plain.deserialize(summon.bottom.name),
            box1: Value.fromJSON(summon.bottom.box1),
            box2: Value.fromJSON(summon.bottom.box2),
            box3: Value.fromJSON(summon.bottom.box3),
            box4: Value.fromJSON(summon.bottom.box4),
            box5: Value.fromJSON(summon.bottom.box5),
          },
        },
      })
    }
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    const {
      color,
      actions,
      hexes,
      title,
      level,
      initiative,
      summon,
    } = this.state
    ls.set<CardJSON>('data', {
      color,
      actions: Object.fromEntries(Object.entries(actions).map(([key, value]) => {
        return [key, {
          value: value.value.toJSON(),
          x: value.x,
          y: value.y,
        }]
      })),
      hexes,
      title: Plain.serialize(title),
      level: Plain.serialize(level),
      initiative: Plain.serialize(initiative),
      summon: {
        top: {
          visible: summon.top.visible,
          name: Plain.serialize(summon.top.name),
          box1: summon.top.box1.toJSON(),
          box2: summon.top.box2.toJSON(),
          box3: summon.top.box3.toJSON(),
          box4: summon.top.box4.toJSON(),
          box5: summon.top.box5.toJSON(),
        },
        bottom: {
          visible: summon.bottom.visible,
          name: Plain.serialize(summon.bottom.name),
          box1: summon.bottom.box1.toJSON(),
          box2: summon.bottom.box2.toJSON(),
          box3: summon.bottom.box3.toJSON(),
          box4: summon.bottom.box4.toJSON(),
          box5: summon.bottom.box5.toJSON(),
        },
      },
    })
  }

  render() {
    return (
      <div className="app">
        <Toolbar
          color={this.state.color}
          onPrintClick={this.onPrintClick}
          onColorChange={this.onColorChange}
          onCursorChange={this.onCursorChange}
          onDeleteClick={this.onDeleteClick}
        />
        <div id="card-container">
          <Card
            data={this.state}
            cursor={this.state.cursor}
            onDataChange={this.onDataChange}
            onCursorChange={this.onCursorChange}
          />
        </div>
      </div>
    )
  }
}

export default App
