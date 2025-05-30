import {
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from 'react-icons/md'

export const IMPACTS_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}
export const IMPACT_LEVEL_ICONS = {
  low: <MdOutlineSignalCellularAlt1Bar />,
  medium: <MdOutlineSignalCellularAlt2Bar />,
  high: <MdOutlineSignalCellularAlt />,
}
export const IMPACT_LEVELS_LABELS = {
  low: 'Low Impact',
  medium: 'Medium Impact',
  high: 'High Impact',
}

export const NUM_OF_MOCK_OUTREACHES = 10

export const OUTREACH_TYPE_MAPPING = {
  p2pTexting: 'Text message',
  doorKnocking: 'Door knocking',
  phoneBanking: 'Phone banking',
}
