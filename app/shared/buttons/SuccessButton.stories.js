import { argTypes } from './buttonsArgTypes'
import SuccessButtonComponent from './SuccessButton'

export default {
  title: 'Buttons/SuccessButton',
  component: SuccessButtonComponent,
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
