import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import {
  RadioCardItem,
  RadioGroup,
  RadioGroupItem,
} from '../components/ui/radio-group'
import { Label } from '../components/ui/label'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable every item in the group.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

type PlaygroundArgs = {
  value: string
  disabled: boolean
  orientation: 'horizontal' | 'vertical'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    value: 'comfortable',
    disabled: false,
    orientation: 'vertical',
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Controlled selection.',
    },
  },
  render: ({ value, disabled, orientation }) => {
    const [, updateArgs] = useArgs()
    return (
      <RadioGroup
        value={value}
        onValueChange={(next) => updateArgs({ value: next })}
        disabled={disabled}
        orientation={orientation}
        className={orientation === 'horizontal' ? 'flex gap-4' : undefined}
      >
        {['default', 'comfortable', 'compact'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`playground-${option}`} />
            <Label htmlFor={`playground-${option}`} className="capitalize">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  },
}

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="card" id="card" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="card">Card</Label>
          <p className="text-sm text-muted-foreground">
            Pay with your credit card.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="paypal" id="paypal" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="paypal">PayPal</Label>
          <p className="text-sm text-muted-foreground">
            Pay with your PayPal account.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="d-option-1" />
        <Label htmlFor="d-option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="d-option-2" disabled />
        <Label htmlFor="d-option-2" className="text-muted-foreground">
          Option 2 (Disabled)
        </Label>
      </div>
    </RadioGroup>
  ),
}

export const CardVariant: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <RadioCardItem
        value="option-1"
        id="card-option-1"
        title="Radio Button Text"
        description="This is a radio description."
      />
      <RadioCardItem
        value="option-2"
        id="card-option-2"
        title="Radio Button Text"
        description="This is a radio description."
      />
    </RadioGroup>
  ),
}
