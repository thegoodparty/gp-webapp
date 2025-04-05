import Button, { COLOR_CLASSES, SIZE_CLASSES } from './Button'

const argTypes = {
  size: {
    control: 'select',
    options: Object.keys(SIZE_CLASSES),
    description: 'Button size',
    table: {
      type: {
        summary: 'string',
      },
    },
  },
  color: {
    control: 'select',
    options: Object.keys(COLOR_CLASSES),
    description: 'Color theme to use for button',
    table: {
      type: {
        summary: 'string',
      },
    },
  },
  children: {
    description: 'JSX content inside the button',
    table: {
      type: {
        summary: 'node',
      },
    },
  },
  className: {
    description: 'classes to add to / override default classes',
  },
  loading: {
    options: [true, false],
    control: { type: 'select' },
    description: 'Loading state',
    table: {
      type: {
        summary: 'select',
      },
      defaultValue: { summary: false },
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
}

export default {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Click Me',
  },
  argTypes: argTypes,
  render: (args) => (
    <div class={'flex gap-2' + (args.color === 'white' ? ' bg-black p-2' : '')}>
      <Button {...args} variant="contained">
        Contained
      </Button>
      <Button {...args} variant="outlined">
        Outlined
      </Button>
      <Button {...args} variant="text">
        Text
      </Button>
      <Button
        {...args}
        variant="contained"
        href="https://goodparty.org"
        onClick={(e) => e.preventDefault()}
      >
        Contained Link
      </Button>

      <Button
        {...args}
        variant="outlined"
        href="https://goodparty.org"
        onClick={(e) => e.preventDefault()}
      >
        Outlined Link
      </Button>

      <Button
        {...args}
        variant="text"
        href="https://goodparty.org"
        onClick={(e) => e.preventDefault()}
      >
        Text Link
      </Button>
    </div>
  ),
}

export const Primary = {
  args: {
    size: 'medium',
    color: 'primary',
  },
}

export const Secondary = {
  args: {
    size: 'medium',
    color: 'secondary',
  },
}

export const Tertiary = {
  args: {
    size: 'medium',
    color: 'tertiary',
  },
}

export const Error = {
  args: {
    size: 'medium',
    color: 'error',
  },
}

export const Warning = {
  args: {
    size: 'medium',
    color: 'warning',
  },
}

export const Info = {
  args: {
    size: 'medium',
    color: 'info',
  },
}

export const Success = {
  args: {
    size: 'medium',
    color: 'success',
  },
}

export const Neutral = {
  args: {
    size: 'medium',
    color: 'neutral',
  },
}

export const White = {
  args: {
    size: 'medium',
    color: 'white',
  },
}
