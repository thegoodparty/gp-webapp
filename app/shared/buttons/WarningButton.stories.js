import { argTypes } from './buttonsArgTypes'
import WarningButtonComponent from './WarningButton'

export default {
  title: 'Buttons/WarningButton',
  component: WarningButtonComponent,
  tags: ['autodocs'],
  args: {
    children: 'Button text',
  },

  argTypes: argTypes,
}

export const Primary = {
  args: {
    variant: 'contained',
  },
}

export const Outlined = {
  args: {
    variant: 'outlined',
  },
}

export const Text = {
  args: {
    variant: 'text',
  },
}
