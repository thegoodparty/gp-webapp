import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    checked: {
      control: 'boolean',
      description:
        'Controlled checked state. Toggling this in Controls updates the checkbox immediately.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

type PlaygroundArgs = {
  checked: boolean
  disabled: boolean
  labelText: string
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    checked: false,
    disabled: false,
    labelText: 'Accept terms and conditions',
  },
  argTypes: {
    labelText: { control: 'text' },
  },
  render: ({ checked, disabled, labelText }) => {
    const [, updateArgs] = useArgs()
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="playground"
          checked={checked}
          disabled={disabled}
          onCheckedChange={(next) =>
            updateArgs({ checked: next === 'indeterminate' ? false : next })
          }
        />
        <Label htmlFor="playground">{labelText}</Label>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms1">Accept terms and conditions</Label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled" className="text-muted-foreground">
        Disabled checkbox
      </Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Checked by default</Label>
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </div>
  ),
}
