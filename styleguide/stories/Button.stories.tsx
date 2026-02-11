import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../components/ui/button'
import { IconButton } from '../components/ui/icon-button'
import { DownloadIcon } from '../components/ui/icons'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Click Me',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
}

export const WhiteGhost: Story = {
  args: {
    children: 'White Ghost',
    variant: 'whiteGhost',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-800 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export const WhiteOutline: Story = {
  args: {
    children: 'White Outline',
    variant: 'whiteOutline',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-800 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export const WithIcon: Story = {
  args: {
    children: 'Download',
    variant: 'default',
    icon: <DownloadIcon className="h-4 w-4" />,
  },
}

export const IconPlacement: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <Button
        {...args}
        icon={<DownloadIcon className="h-4 w-4" />}
        iconPosition="left"
      >
        Icon Left
      </Button>
      <Button
        {...args}
        icon={<DownloadIcon className="h-4 w-4" />}
        iconPosition="right"
      >
        Icon Right
      </Button>
    </div>
  ),
  args: {
    variant: 'default',
  },
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button size="xSmall">xSmall (24px)</Button>
        <Button size="small">Small (32px)</Button>
        <Button size="medium">Medium (40px)</Button>
        <Button size="large">Large (48px)</Button>
      </div>
    </div>
  ),
}

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Loading States</h3>
      <div className="flex gap-4">
        <Button variant="default" loading>
          Loading...
        </Button>
        <Button variant="secondary" loading>
          Loading...
        </Button>
        <Button variant="destructive" loading>
          Loading...
        </Button>
        <Button variant="outline" loading>
          Loading...
        </Button>
        <Button variant="ghost" loading>
          Loading...
        </Button>
        <Button variant="link" loading>
          Loading...
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default" loading loadingText="Saving...">
          Save
        </Button>
        <Button variant="secondary" loading loadingText="Processing...">
          Process
        </Button>
        <Button variant="destructive" loading loadingText="Deleting...">
          Delete
        </Button>
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
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
        <div key={variant} className="flex gap-4">
          <Button variant={variant} size="large">
            {variant} Enabled
          </Button>
          <Button variant={variant} size="large" disabled>
            {variant} Disabled
          </Button>
          <Button variant={variant} size="large" loading>
            {variant} Loading
          </Button>
        </div>
      ))}
      {/* White variants on dark background */}
      {(['whiteOutline', 'whiteGhost'] as const).map((variant) => (
        <div key={variant} className="flex gap-4 bg-gray-800 p-4 rounded-lg">
          <Button variant={variant} size="large">
            {variant} Enabled
          </Button>
          <Button variant={variant} size="large" disabled>
            {variant} Disabled
          </Button>
          <Button variant={variant} size="large" loading>
            {variant} Loading
          </Button>
        </div>
      ))}
    </div>
  ),
}

// Comprehensive state matrix matching Figma design
export const StateMatrix: Story = {
  render: () => {
    const variants = [
      { name: 'Default', variant: 'default' as const, darkBg: false },
      { name: 'Secondary', variant: 'secondary' as const, darkBg: false },
      { name: 'Destructive', variant: 'destructive' as const, darkBg: false },
      { name: 'Outline', variant: 'outline' as const, darkBg: false },
      { name: 'Ghost', variant: 'ghost' as const, darkBg: false },
      { name: 'Link', variant: 'link' as const, darkBg: false },
    ]

    const sizes = [
      { name: 'sm', size: 'small' as const },
      { name: 'md', size: 'medium' as const },
      { name: 'lg', size: 'large' as const },
    ]

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Button State Matrix</h2>

        {variants.map(({ name, variant, darkBg }) => (
          <div
            key={variant}
            className={`p-6 rounded-lg ${darkBg ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${darkBg ? 'text-white' : 'text-gray-900'}`}
            >
              {name}
            </h3>

            {/* Default size row */}
            <div className="mb-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div
                  className={`text-sm font-medium ${darkBg ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  default
                </div>
                <Button variant={variant} size="medium">
                  Button
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="hover:opacity-80"
                >
                  Button
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="focus-visible:ring-2"
                >
                  Button
                </Button>
                <Button variant={variant} size="medium" loading>
                  Button
                </Button>
                <Button variant={variant} size="medium" disabled>
                  Button
                </Button>
              </div>
            </div>

            {/* Icon only row */}
            <div className="mb-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div
                  className={`text-sm font-medium ${darkBg ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  icon
                </div>
                <Button
                  variant={variant}
                  size="medium"
                  className="w-10 h-10 p-0"
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="w-10 h-10 p-0 hover:opacity-80"
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="w-10 h-10 p-0 focus-visible:ring-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="w-10 h-10 p-0"
                  loading
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={variant}
                  size="medium"
                  className="w-10 h-10 p-0"
                  disabled
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Size variations */}
            {sizes.map(({ name: sizeName, size }) => (
              <div key={sizeName} className="mb-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div
                    className={`text-sm font-medium ${darkBg ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {sizeName}
                  </div>
                  <Button variant={variant} size={size}>
                    Button
                  </Button>
                  <Button
                    variant={variant}
                    size={size}
                    className="hover:opacity-80"
                  >
                    Button
                  </Button>
                  <Button
                    variant={variant}
                    size={size}
                    className="focus-visible:ring-2"
                  >
                    Button
                  </Button>
                  <Button variant={variant} size={size} loading>
                    Button
                  </Button>
                  <Button variant={variant} size={size} disabled>
                    Button
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* State labels header */}
        <div className="grid grid-cols-5 gap-4 items-center text-sm font-medium text-gray-500 border-t pt-4">
          <div></div>
          <div className="text-center">Default</div>
          <div className="text-center">Hover</div>
          <div className="text-center">Focus</div>
          <div className="text-center">Loading</div>
          <div className="text-center">Disabled</div>
        </div>
      </div>
    )
  },
}

export const IconButtonSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton size="xSmall" aria-label="Extra small icon button">
        <DownloadIcon className="h-3 w-3" />
      </IconButton>
      <IconButton size="small" aria-label="Small icon button">
        <DownloadIcon className="h-4 w-4" />
      </IconButton>
      <IconButton size="medium" aria-label="Medium icon button">
        <DownloadIcon className="h-5 w-5" />
      </IconButton>
      <IconButton size="large" aria-label="Large icon button">
        <DownloadIcon className="h-6 w-6" />
      </IconButton>
      <IconButton size="xLarge" aria-label="Extra large icon button">
        <DownloadIcon className="h-8 w-8" />
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
            <DownloadIcon className="h-5 w-5" />
          </IconButton>
        ))}
      </div>
      {/* White variants on dark background */}
      <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
        {(['whiteOutline', 'whiteGhost'] as const).map((variant) => (
          <IconButton key={variant} variant={variant} aria-label={variant}>
            <DownloadIcon className="h-5 w-5" />
          </IconButton>
        ))}
      </div>
      {/* Loading states */}
      <div className="flex items-center gap-4">
        <h4 className="text-sm font-medium">Loading States:</h4>
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
          <IconButton
            key={variant}
            variant={variant}
            loading
            aria-label={`${variant} loading`}
          >
            <DownloadIcon className="h-5 w-5" />
          </IconButton>
        ))}
      </div>
    </div>
  ),
}
