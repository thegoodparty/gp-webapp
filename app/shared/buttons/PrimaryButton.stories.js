import { argTypes } from './buttonsArgTypes'
import PrimaryButtonComponent from './PrimaryButton'

export default {
  title: 'Buttons/PrimaryButton',
  component: PrimaryButtonComponent,
  tags: ['autodocs'],
  args: {
    children: 'Button text',
  },

  argTypes,
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
