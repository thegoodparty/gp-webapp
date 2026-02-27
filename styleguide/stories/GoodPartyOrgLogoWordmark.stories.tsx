import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { GoodPartyOrgLogoWordmark } from '../components/ui/good-party-org-logo-wordmark'

const meta: Meta<typeof GoodPartyOrgLogoWordmark> = {
  title: 'Components/GoodPartyOrgLogoWordmark',
  component: GoodPartyOrgLogoWordmark,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof GoodPartyOrgLogoWordmark>

export const Default: Story = {
  args: {},
}

export const DarkText: Story = {
  args: {
    textVariant: 'dark',
  },
}

export const WithCustomClassName: Story = {
  args: {
    className: 'opacity-75',
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Small (149px × 20px)</h3>
        <GoodPartyOrgLogoWordmark size="small" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Default (208px × 28px)</h3>
        <GoodPartyOrgLogoWordmark size="default" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Large (313px × 42px)</h3>
        <GoodPartyOrgLogoWordmark size="large" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Extra Large (500px × 67px)</h3>
        <GoodPartyOrgLogoWordmark size="xl" />
      </div>
    </div>
  ),
}

export const OnDifferentBackgrounds: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 p-6 bg-white border rounded-lg">
        <h3 className="text-sm font-medium text-gray-900">White Background</h3>
        <GoodPartyOrgLogoWordmark />
      </div>
      <div className="flex flex-col items-center gap-2 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900">
          Light Gray Background
        </h3>
        <GoodPartyOrgLogoWordmark />
      </div>
      <div className="flex flex-col items-center gap-2 p-6 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-white">Dark Background</h3>
        <GoodPartyOrgLogoWordmark />
      </div>
    </div>
  ),
}

export const ResponsivePreview: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-sm font-medium">
        Responsive Sizing (resize viewport to see changes)
      </h3>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <GoodPartyOrgLogoWordmark />
      </div>
      <p className="text-xs text-gray-600 max-w-md text-center">
        Default: 208px × 28px, Large screens (lg+): 313px × 42px
      </p>
    </div>
  ),
}

export const WithHoverEffects: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Hover Scale</h3>
        <GoodPartyOrgLogoWordmark className="hover:scale-110 transition-transform cursor-pointer" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Hover Opacity</h3>
        <GoodPartyOrgLogoWordmark className="hover:opacity-75 transition-opacity cursor-pointer" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Hover Rotate</h3>
        <GoodPartyOrgLogoWordmark className="hover:rotate-2 transition-transform cursor-pointer" />
      </div>
    </div>
  ),
}
