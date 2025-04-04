import { argTypes } from './buttonsArgTypes'
import InfoButtonComponent from './InfoButton'

export default {
  title: 'Buttons/InfoButton',
  component: InfoButtonComponent,
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
