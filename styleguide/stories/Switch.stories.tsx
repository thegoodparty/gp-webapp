import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import { useState } from 'react'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the switch so it cannot be toggled.',
    },
    checked: {
      control: 'boolean',
      description:
        'Controlled checked state. Toggling this in Controls updates the switch immediately.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Playground: Story = {
  args: {
    disabled: false,
    checked: false,
  },
  render: ({ checked, disabled }) => {
    const [, updateArgs] = useArgs()
    return (
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => updateArgs({ checked: next })}
      />
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [enabled, setEnabled] = useState(true)
      return (
        <div className="flex items-center gap-2">
          <Switch
            id="notifications"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="notifications">
            Notifications {enabled ? 'on' : 'off'}
          </Label>
        </div>
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off">Disabled, off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on">Disabled, on</Label>
      </div>
    </div>
  ),
}
