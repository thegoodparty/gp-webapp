import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../components/ui/button'
import { IconButton } from '../components/ui/icon-button'
import { DownloadIcon } from '../components/ui/icons'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'whiteOutline',
        'whiteGhost',
      ],
    },
    size: {
      control: 'select',
      options: ['xSmall', 'small', 'medium', 'large'],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      if: { arg: 'showIcon', truthy: true },
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

type PlaygroundArgs = {
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'whiteOutline'
    | 'whiteGhost'
  size: 'xSmall' | 'small' | 'medium' | 'large'
  disabled: boolean
  loading: boolean
  loadingText: string
  children: string
  showIcon: boolean
  iconPosition: 'left' | 'right'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    variant: 'default',
    size: 'medium',
    disabled: false,
    loading: false,
    loadingText: '',
    children: 'Click me',
    showIcon: false,
    iconPosition: 'left',
  },
  argTypes: {
    loadingText: {
      control: 'text',
      if: { arg: 'loading', truthy: true },
    },
    children: { control: 'text' },
    showIcon: { control: 'boolean' },
  },
  render: ({ showIcon, children, loadingText, ...buttonArgs }) => {
    const button = (
      <Button
        {...buttonArgs}
        loadingText={loadingText || undefined}
        icon={showIcon ? <DownloadIcon /> : undefined}
      >
        {children}
      </Button>
    )
    if (
      buttonArgs.variant === 'whiteOutline' ||
      buttonArgs.variant === 'whiteGhost'
    ) {
      return <div className="rounded-lg bg-base-background-dark p-8">{button}</div>
    }
    return button
  },
}

export const Default: Story = {
  args: { children: 'Click Me', variant: 'default' },
}

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
}

export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
}

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
}

export const Link: Story = {
  args: { children: 'Link Button', variant: 'link' },
}

export const WhiteGhost: Story = {
  args: { children: 'White Ghost', variant: 'whiteGhost' },
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-base-background-dark p-8">
        <Story />
      </div>
    ),
  ],
}

export const WhiteOutline: Story = {
  args: { children: 'White Outline', variant: 'whiteOutline' },
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-base-background-dark p-8">
        <Story />
      </div>
    ),
  ],
}

export const WithIcon: Story = {
  args: {
    children: 'Download',
    variant: 'default',
    icon: <DownloadIcon />,
  },
}

export const IconPlacement: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Button {...args} icon={<DownloadIcon />} iconPosition="left">
        Icon Left
      </Button>
      <Button {...args} icon={<DownloadIcon />} iconPosition="right">
        Icon Right
      </Button>
    </div>
  ),
  args: { variant: 'default' },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'default',
    loading: true,
  },
}

export const LoadingWithCustomText: Story = {
  args: {
    children: 'Save',
    variant: 'default',
    loading: true,
    loadingText: 'Saving...',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xSmall">xSmall (24px)</Button>
      <Button size="small">Small (32px)</Button>
      <Button size="medium">Medium (40px)</Button>
      <Button size="large">Large (48px)</Button>
    </div>
  ),
}

export const IconButtonSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton size="xSmall" aria-label="Extra small icon button">
        <DownloadIcon className="size-3" />
      </IconButton>
      <IconButton size="small" aria-label="Small icon button">
        <DownloadIcon className="size-4" />
      </IconButton>
      <IconButton size="medium" aria-label="Medium icon button">
        <DownloadIcon className="size-5" />
      </IconButton>
      <IconButton size="large" aria-label="Large icon button">
        <DownloadIcon className="size-6" />
      </IconButton>
      <IconButton size="xLarge" aria-label="Extra large icon button">
        <DownloadIcon className="size-8" />
      </IconButton>
    </div>
  ),
}

export const IconButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {(
          [
            'default',
            'secondary',
            'destructive',
            'outline',
            'ghost',
            'link',
          ] as const
        ).map((variant) => (
          <IconButton key={variant} variant={variant} aria-label={variant}>
            <DownloadIcon className="size-5" />
          </IconButton>
        ))}
      </div>
      <div className="flex items-center gap-4 rounded-lg bg-base-background-dark p-4">
        {(['whiteOutline', 'whiteGhost'] as const).map((variant) => (
          <IconButton key={variant} variant={variant} aria-label={variant}>
            <DownloadIcon className="size-5" />
          </IconButton>
        ))}
      </div>
    </div>
  ),
}
