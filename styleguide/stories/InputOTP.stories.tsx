import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../components/ui/input-otp'

const meta: Meta<typeof InputOTP> = {
  title: 'Components/Input OTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 4, max: 8, step: 1 },
      description: 'Total number of slots.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input.',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputOTP>

export const Playground: Story = {
  args: {
    maxLength: 6,
    disabled: false,
  },
  render: ({ maxLength = 6, disabled }) => (
    <InputOTP maxLength={maxLength} disabled={disabled}>
      <InputOTPGroup>
        {Array.from({ length: maxLength }).map((_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('')
      return (
        <div className="space-y-2">
          <InputOTP maxLength={6} value={value} onChange={setValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-muted-foreground text-sm">
            Entered: <span className="font-mono">{value || '—'}</span>
          </p>
        </div>
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}
