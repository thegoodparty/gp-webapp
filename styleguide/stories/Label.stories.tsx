import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

type PlaygroundArgs = {
  text: string
  htmlFor: string
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    text: 'Email',
    htmlFor: 'playground-email',
  },
  argTypes: {
    text: { control: 'text' },
    htmlFor: {
      control: 'text',
      description:
        'Element id the label is bound to. Clicking the label should focus the input below.',
    },
  },
  render: ({ text, htmlFor }) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={htmlFor}>{text}</Label>
      <Input type="email" id={htmlFor} placeholder="Enter your email" />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithRadioGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
}
