import React from 'react'


export interface ActionProps {
  className?: string
  text: string
  action: string
  icon?: any
  iconOnly?: boolean
  data?: {
    [key: string]: any
  }
  children?: any
}

export const Action: React.FC<ActionProps> = (props) => {
  return (
    <div className={props.className || 'action'}>
      <span>{props.data && props.data.iconOnly ? '' : props.text}</span>
      {props.children && <span>{props.children}</span>}
      <img alt={props.text} src={props.icon || require(`../assets/${props.action}.png`)}/>
    </div>
  )
}

export const AttackAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Attack',
  action: 'attack',
  ...props
})
export const HealAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Heal',
  action: 'heal',
  ...props
})
export const RangeAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Range',
  action: 'range',
  ...props
})
export const TargetAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Target',
  action: 'target',
  ...props
})
export const MoveAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Move',
  action: 'move',
  ...props
})
export const JumpAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Jump',
  action: 'jump',
  ...props
})
export const FlyingAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Flying',
  action: 'flying',
  ...props
})
export const ShieldAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Shield',
  action: 'shield',
  ...props
})
export const RetaliateAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Retaliate',
  action: 'retaliate',
  ...props
})
export const LootAction: React.FC<Partial<ActionProps>> = (props) => Action({
  text: 'Loot',
  action: 'loot',
  ...props
})

export const StatusAction: React.FC<ActionProps> = (props) => Action({className: 'action status',
  ...props
})

export const AddTargetEffectAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'ADD TARGET',
  action: 'effect-add-target',
  ...props
})
export const PierceEffectAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'PIECE',
  action: 'effect-pierce',
  ...props
})
export const PushEffectAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'PUSH',
  action: 'effect-push',
  ...props
})
export const PullEffectAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'PULL',
  action: 'effect-pull',
  ...props
})

export const PoisonStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'POISON',
  action: 'status-poison',
  ...props
})
export const WoundStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'WOUND',
  action: 'status-wound',
  ...props
})
export const ImmobilizeStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'IMMOBILIZE',
  action: 'status-immobilize',
  ...props
})
export const DisarmStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'DISARM',
  action: 'status-disarm',
  ...props
})
export const StunStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'STUN',
  action: 'status-stun',
  ...props
})
export const MuddleStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'MUDDLE',
  action: 'status-muddle',
  ...props
})
export const CurseAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'CURSE',
  action: 'curse',
  ...props
})

export const InvisibleStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'INVISIBLE',
  action: 'status-invisible',
  ...props
})
export const StrengthenStatusAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'STRENGTHEN',
  action: 'status-strengthen',
  ...props
})
export const BlessAction: React.FC<Partial<ActionProps>> = (props) => StatusAction({
  text: 'BLESS',
  action: 'bless',
  ...props,
})

export const XPAction: React.FC<ActionProps> = (props) => {
  return (
    <div className={`action xp ${props.data && props.data.size}`}>
      <img alt='xp' src={require('../assets/xp.png')}/>
      <span>{props.children}</span>
    </div>
  )
}

export const ElementAction: React.FC<ActionProps> = (props) => Action({
  className: 'action element',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})

export const AllElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'All',
  action: 'element-all',
  ...props,
})
export const FireElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Fire',
  action: 'element-fire',
  ...props,
})
export const IceElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Ice',
  action: 'element-ice',
  ...props,
})
export const AirElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Air',
  action: 'element-air',
  ...props,
})
export const EarthElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Earth',
  action: 'element-earth',
  ...props,
})
export const DarkElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Dark',
  action: 'element-dark',
  ...props,
})
export const LightElementAction: React.FC<Partial<ActionProps>> = (props) => ElementAction({
  text: 'Light',
  action: 'element-light',
  ...props,
})

export const RoundAction: React.FC<Partial<ActionProps>> = (props) => Action({
  className: 'action big-icon',
  text: 'Round',
  action: 'round',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})
export const PersistentAction: React.FC<Partial<ActionProps>> = (props) => Action({
  className: 'action big-icon',
  text: 'Persistent',
  action: 'persistent',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})

export const CardLostAction: React.FC<Partial<ActionProps>> = (props) => Action({
  className: 'action big-icon',
  text: 'Card Lost',
  action: 'card-lost',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})
export const CardRecoverAction: React.FC<Partial<ActionProps>> = (props) => Action({
  className: 'action big-icon',
  text: 'Card Recover',
  action: 'card-recover',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})
export const CardUnrecoverableAction: React.FC<Partial<ActionProps>> = (props) => Action({
  className: 'action big-icon',
  text: 'Card Unrecoverable',
  action: 'card-unrecoverable',
  ...props,
  data: {
    iconOnly: true,
    ...props.data,
  },
})

export function renderActions(props: any, editor: any, next: () => any) {
  const { attributes, children, node } = props

  const childAttributes: any = {
    data: Object.fromEntries(node.data),
    children: children,
  }

  switch (node.type) {
    case 'attack':
      return <div className="inline-action" {...attributes}><AttackAction {...childAttributes}/></div>
    case 'heal':
      return <div className="inline-action" {...attributes}><HealAction {...childAttributes}/></div>
    case 'range':
      return <div className="inline-action" {...attributes}><RangeAction {...childAttributes}/></div>
    case 'target':
      return <div className="inline-action" {...attributes}><TargetAction {...childAttributes}/></div>
    case 'move':
      return <div className="inline-action" {...attributes}><MoveAction {...childAttributes}/></div>
    case 'jump':
      return <div className="inline-action" {...attributes}><JumpAction {...childAttributes}/></div>
    case 'flying':
      return <div className="inline-action" {...attributes}><FlyingAction {...childAttributes}/></div>
    case 'shield':
      return <div className="inline-action" {...attributes}><ShieldAction {...childAttributes}/></div>
    case 'retaliate':
      return <div className="inline-action" {...attributes}><RetaliateAction {...childAttributes}/></div>
    case 'loot':
      return <div className="inline-action" {...attributes}><LootAction {...childAttributes}/></div>
    case 'xp':
      return <div className="inline-action" {...attributes}><XPAction {...childAttributes}/></div>
    case 'round':
      return <div className="inline-action" {...attributes}><RoundAction {...childAttributes}/></div>
    case 'persistent':
      return <div className="inline-action" {...attributes}><PersistentAction {...childAttributes}/></div>
    case 'element-all':
      return <div className="inline-action" {...attributes}><AllElementAction {...childAttributes}/></div>
    case 'element-fire':
      return <div className="inline-action" {...attributes}><FireElementAction {...childAttributes}/></div>
    case 'element-ice':
      return <div className="inline-action" {...attributes}><IceElementAction {...childAttributes}/></div>
    case 'element-air':
      return <div className="inline-action" {...attributes}><AirElementAction {...childAttributes}/></div>
    case 'element-earth':
      return <div className="inline-action" {...attributes}><EarthElementAction {...childAttributes}/></div>
    case 'element-light':
      return <div className="inline-action" {...attributes}><LightElementAction {...childAttributes}/></div>
    case 'element-dark':
      return <div className="inline-action" {...attributes}><DarkElementAction {...childAttributes}/></div>
    case 'effect-add-target':
      return <div className="inline-action" {...attributes}><AddTargetEffectAction {...childAttributes}/></div>
    case 'effect-push':
      return <div className="inline-action" {...attributes}><PushEffectAction {...childAttributes}/></div>
    case 'effect-pull':
      return <div className="inline-action" {...attributes}><PullEffectAction {...childAttributes}/></div>
    case 'effect-pierce':
      return <div className="inline-action" {...attributes}><PierceEffectAction {...childAttributes}/></div>
    case 'status-poison':
      return <div className="inline-action" {...attributes}><PoisonStatusAction {...childAttributes}/></div>
    case 'status-wound':
      return <div className="inline-action" {...attributes}><WoundStatusAction {...childAttributes}/></div>
    case 'status-immobilize':
      return <div className="inline-action" {...attributes}><ImmobilizeStatusAction {...childAttributes}/></div>
    case 'status-disarm':
      return <div className="inline-action" {...attributes}><DisarmStatusAction {...childAttributes}/></div>
    case 'status-stun':
      return <div className="inline-action" {...attributes}><StunStatusAction {...childAttributes}/></div>
    case 'status-muddle':
      return <div className="inline-action" {...attributes}><MuddleStatusAction {...childAttributes}/></div>
    case 'curse':
      return <div className="inline-action" {...attributes}><CurseAction {...childAttributes}/></div>
    case 'status-invisible':
      return <div className="inline-action" {...attributes}><InvisibleStatusAction {...childAttributes}/></div>
    case 'status-strengthen':
      return <div className="inline-action" {...attributes}><StrengthenStatusAction {...childAttributes}/></div>
    case 'bless':
      return <div className="inline-action" {...attributes}><BlessAction {...childAttributes}/></div>
    case 'card-lost':
      return <div className="inline-action" {...attributes}><CardLostAction {...childAttributes}/></div>
    case 'card-recover':
      return <div className="inline-action" {...attributes}><CardRecoverAction {...childAttributes}/></div>
    case 'card-unrecoverable':
      return <div className="inline-action" {...attributes}><CardUnrecoverableAction {...childAttributes}/></div>
    default:
      return next()
  }
}
