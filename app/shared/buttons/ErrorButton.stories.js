import ErrorButtonComponent from './ErrorButton';
import { argTypes } from './PrimaryButton.stories';

export default {
  title: 'Buttons/ErrorButton',
  component: ErrorButtonComponent,
  tags: ['autodocs'],
  args: {
    children: 'Button text',
  },

  argTypes: argTypes,
};

export const Primary = {
  args: {
    variant: 'contained',
  },
};

export const Outlined = {
  args: {
    variant: 'outlined',
  },
};

export const Text = {
  args: {
    variant: 'text',
  },
};
