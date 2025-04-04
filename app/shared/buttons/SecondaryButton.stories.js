import SecondaryButtonComponent from './SecondaryButton'
import { argTypes } from './buttonsArgTypes'

export default {
  title: 'Buttons/SecondaryButton',
  component: SecondaryButtonComponent,
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
