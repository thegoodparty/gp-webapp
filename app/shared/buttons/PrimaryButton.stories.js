import PrimaryButtonComponent from './PrimaryButton';

export default {
  title: 'Buttons/PrimaryButton',
  component: PrimaryButtonComponent,
  tags: ['autodocs'],
  args: {
    children: 'Button text',
  },

  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'button variant. Contained, outlined or text',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    children: {
      description: 'the text or JSX inside the button',
      table: {
        type: {
          summary: 'node',
        },
      },
    },
    style: {
      description: 'style object to override default styles',
      table: {
        type: {
          summary: 'object',
        },
      },
    },
    className: {
      control: 'text',
      description: 'classes to override default classes',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
      description: 'Button size',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    disabled: {
      options: [true, false],
      control: { type: 'select' },
      description: 'Disabled state',
      table: {
        type: {
          summary: 'select',
        },
        defaultValue: { summary: false },
      },
    },
    loading: {
      options: [true, false],
      control: { type: 'select' },
      description: 'Disabled state',
      table: {
        type: {
          summary: 'select',
        },
        defaultValue: { summary: false },
      },
    },
  },
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
