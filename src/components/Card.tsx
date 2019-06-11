import React from 'react';

import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer'

import { generateUUIDv4 } from '@bitjourney/uuid-v4';

import { ActionEditor, ActionContent } from './ActionEditor'
import { Summon } from './Summon'
import { Image } from './Image'


interface CardData {
  actions: {
    [key: string]: ActionContent,
  };
  title: Value;
  level: Value;
  initiative: Value;
  summonTop: boolean;
  summonBottom: boolean;
}


export interface CardProps {
  color: string;
  data?: CardData;
  cursor: 'move' | 'text' | null;
  onDataChange: (data: CardData) => void;
  onCursorChange: (cursor: 'move' | 'text' | null) => void;
};

export interface CardState extends CardData {
  actions: {
    [key: string]: ActionContent,
  };
  title: Value;
  level: Value;
  initiative: Value;
  summonTop: boolean;
  summonBottom: boolean;

  mouse?: {
    key: string;
    x: number;
    y: number;
  }
};

export class Card extends React.Component<CardProps, CardState> {
  editor?: Editor;

  constructor(props: CardProps) {
    super(props);

    this.state = {
      actions: {},
      title: Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'text',
                  text: 'Card Name',
                  marks: [{
                    type: 'card-title',
                    data: {
                      color: props.color
                    }
                  }]
                }
              ]
            }
          ]
        }
      } as any),
      level: Plain.deserialize('1'),
      initiative: Plain.deserialize('00'),
      summonTop: false,
      summonBottom: false,
      ...(props.data || {}),
    }
  }

  onDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  }

  onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const action = e.dataTransfer.getData('action');
    if (typeof(action) !== 'string') return false;

    const data = JSON.parse(e.dataTransfer.getData('data')) || {};
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let value: Value;
    if (action === 'text') {
      value = Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  object: 'text',
                  text: ' '
                }
              ],
            }
          ]
        }
      } as any);
    } else {
      value = Value.fromJSON({
        object: 'value',
        document: {
          object: 'document',
          nodes: [
            {
              object: 'block',
              type: 'action-main',
              nodes: [
                {
                  ...data,
                  object: 'inline',
                  type: action,
                }
              ]
            }
          ]
        }
      } as any);
    }

    this.setState({
      actions: {
        ...this.state.actions,
        [generateUUIDv4()]: {
          value: value,
          x: x,
          y: y
        }
      }
    });
    this.props.onCursorChange('text');
  }

  onTitleChange = ({value}) => {
    this.setState({
      title: value,
    });
  }

  onLevelChange = ({value}) => {
    this.setState({
      level: value,
    });
  }

  onInitiativeChange = ({value}) => {
    this.setState({
      initiative: value,
    });
  }

  deleteAction = (key: string) => {
    const actions = {
      ...this.state.actions,
    };
    delete actions[key];

    this.setState({
      actions: {
        ...actions
      },
    });
  }

  onDragAction = (key: string, x: number, y: number) => {
    this.setState({
      mouse: {
        key: key,
        x: x,
        y: y,
      }
    });
  }

  onMouseMove = (e: any) => {
    if (this.props.cursor !== 'move' || !this.state.mouse) return;

    e.preventDefault();
    e.stopPropagation();

    const mouse = this.state.mouse;
    const actions = this.state.actions;
    this.setState({
      actions: {
        ...actions,
        [mouse.key]: {
          ...actions[mouse.key],
          x: e.clientX - mouse.x,
          y: e.clientY - mouse.y,
        }
      },
    });
  }

  onMouseUp = (e: any) => {
    if (this.props.cursor !== 'move' || !this.state.mouse) return;

    e.preventDefault();
    e.stopPropagation();

    this.setState({
      mouse: undefined,
    });
  }

  onToggleSummonTop = (e: any) => {
    this.setState({
      summonTop: !this.state.summonTop,
    });
  }

  onToggleSummonBottom = (e: any) => {
    this.setState({
      summonBottom: !this.state.summonBottom,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.props.onDataChange({
        actions: this.state.actions,
        title: this.state.title,
        level: this.state.level,
        initiative: this.state.initiative,
        summonTop: this.state.summonTop,
        summonBottom: this.state.summonBottom,
      });
    }

    if (prevProps.color === this.props.color) return;

    const editor = this.editor as any;
    editor.value.document.getTexts().forEach((text) => {
      text.marks.forEach((mark) => {
        if (mark.type !== 'card-title') return;

        editor.setMarkByKey(text.key, 0, undefined, mark, {
          type: 'card-title',
          data: {
            color: this.props.color,
          },
        });
      });
    });
  }

  renderTitleMark = (props, editor, next) => {
    if (props.mark.type === 'card-title') {
      let style = {
        backgroundImage: `linear-gradient(${props.mark.data.get('color')}80, white)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
      return <span {...props.attributes} style={style}>{props.children}</span>
    }
    return next();
  }

  ref = (editor: any) => {
    this.editor = editor
  }

  render() {
    return (
      <div className='card'>
        <div>
          <Image alt='card' className='center' src={require('../assets/card.jpg')}/>
          <Image alt='card-runes' className='center runes' src={require('../assets/card-runes.jpg')}/>
          <div className='center color' style={{background: `${this.props.color}80`}}></div>
          <div className='actions' onDrop={this.onDrop} onDragOver={this.onDragOver} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
            <Editor
              className='title single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.title}
              onChange={this.onTitleChange}
              renderMark={this.renderTitleMark}
              ref={this.ref}
            />
            <Editor
              className='level single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.level}
              onChange={this.onLevelChange}
            />
            <Editor
              className='initiative single-line'
              readOnly={this.props.cursor !== 'text'}
              value={this.state.initiative}
              onChange={this.onInitiativeChange}
            />

            {this.state.summonTop ? <Summon className='summon-top center runes'/> : ''}
            {this.state.summonBottom ? <Summon className='summon-bottom center runes'/> : ''}

            {Object.entries(this.state.actions).map(([key, value]) => {
              return <ActionEditor
                key={key}
                cursor={this.props.cursor}
                deleteAction={() => {
                  this.deleteAction(key);
                }}
                onDragAction={(x: number, y: number) => {
                  this.onDragAction(key, x, y);
                }}
                {...value}
              />
            })}
          </div>
        </div>
        <Image
          src={require('../assets/summon1.png')}
          className="summon-toggle top"
          style={{
            filter: this.state.summonTop ? undefined : 'grayscale()',
          }}
          onClick={this.onToggleSummonTop}
        />
        <Image
          src={require('../assets/summon2.png')}
          className="summon-toggle bottom"
          style={{
            filter: this.state.summonBottom ? undefined : 'grayscale()',
          }}
          onClick={this.onToggleSummonBottom}
        />
      </div>
    );
  }
}
