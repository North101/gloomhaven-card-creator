import React from 'react';
import './App.css';

import { Card } from './components/Card';
import { Toolbar } from './components/Toolbar';


interface AppState {
  color: string;
  cursor: 'move' | 'text' | null;
}

class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);

    this.state = {
      color: "#ff0000",
      cursor: 'move',
    }
  }

  onColorChange = (value: string) => {
    this.setState({
      color: value,
    });
  }

  onCursorChange = (value: 'move' | 'text' | null) => {
    this.setState({
      cursor: value,
    });
  }

  render() {
    return (
      <div className="app">
        <Toolbar color={this.state.color} onColorChange={this.onColorChange} onCursorChange={this.onCursorChange}/>
        <div style={{flex: 1, display: 'flex', alignSelf: 'center'}}>
          <Card color={this.state.color} cursor={this.state.cursor} onCursorChange={this.onCursorChange}/>
          </div>
      </div>
    );
  }
}

export default App
