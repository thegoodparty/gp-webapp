export const argTypes = {
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
    description: 'classes to override default classes',
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

  fullWidth: {
    options: [true, false],
    control: { type: 'select' },
    description: 'full width of its parent container',
    table: {
      type: {
        summary: 'select',
      },
      defaultValue: { summary: false },
    },
  },
}
