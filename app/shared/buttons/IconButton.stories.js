import { MdStar } from 'react-icons/md'
import IconButton, { COLOR_CLASSES, SIZE_CLASSES } from './IconButton'

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
    description: 'JSX inside the button, intended to be an Icon component',
    table: {
      type: {
        summary: 'node',
      },
    },
  },
  className: {
    description: 'classes to override default classes',
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
  title: 'Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    children: <MdStar />,
  },

  argTypes: argTypes,
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
