import React from 'react'

import './App.css'
import { Card } from './components/Card'
import { Toolbar } from './components/Toolbar'

interface AppProps {
  color?: string
  data?: any
}


interface AppState {
  cursor: 'move' | 'text' | null
  color: string
  data?: any
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.state = {
      color: props.color || "#ff0000",
      cursor: 'text',
      data: props.data,
    }
  }

  onColorChange = (color: string) => {
    this.setState({
      color: color,
    })
  }

  onCursorChange = (cursor: 'move' | 'text' | null) => {
    this.setState({
      cursor: cursor,
    })
  }

  onDataChange = (data: any) => {
    if (isEquivalent(data, this.state.data)) return

    this.setState({
      data: data,
    })
  }

  onPrintClick = () => {
    this.setState({
      cursor: null,
    }, () => {
      window.print()
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
        />
        <div id="card-container">
          <Card
            data={this.props.data}
            color={this.state.color}
            cursor={this.state.cursor}
            onDataChange={this.onDataChange}
            onCursorChange={this.onCursorChange}
          />
        </div>
      </div>
    )
  }
}

function isEquivalent(a: object | null | undefined, b: object | null | undefined) {
    if (a === b) return true
    if (a === null || a === undefined) return false
    if (b === null || b === undefined) return false

    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true
}

export default App
