import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { CalendarIcon } from '../components/ui/icons'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { Label } from '../components/ui/label'
import { cn } from '../lib/utils'

const meta: Meta = {
  title: 'Components/Date Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Date Picker is not a standalone component — it is the composition of `Popover` (trigger + content) and `Calendar` (selection grid). These stories document the canonical patterns.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function formatDate(date: Date | undefined) {
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type PlaygroundArgs = {
  mode: 'single' | 'range'
  disabled: boolean
  numberOfMonths: number
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    mode: 'single',
    disabled: false,
    numberOfMonths: 1,
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['single', 'range'],
      description: 'Selection mode passed to the Calendar.',
    },
    disabled: { control: 'boolean' },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3, step: 1 },
      description: 'How many months the Calendar renders side by side.',
    },
  },
  render: ({ mode, disabled, numberOfMonths }) => {
    const Demo = () => {
      const [date, setDate] = useState<Date | undefined>()
      const [range, setRange] = useState<
        { from: Date | undefined; to?: Date | undefined } | undefined
      >()
      const label =
        mode === 'single'
          ? date
            ? formatDate(date)
            : 'Pick a date'
          : range?.from
            ? range.to
              ? `${formatDate(range.from)} – ${formatDate(range.to)}`
              : formatDate(range.from)
            : 'Pick a date range'
      const triggerWidth = mode === 'single' ? 'w-72' : 'w-96'
      return (
        <div className={cn('flex flex-col gap-2', triggerWidth)}>
          <Label htmlFor="playground-date">Election day</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="playground-date"
                variant="outline"
                disabled={disabled}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && !range?.from && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {mode === 'single' ? (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={numberOfMonths}
                  autoFocus
                />
              ) : (
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={numberOfMonths}
                  autoFocus
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      )
    }
    return <Demo />
  },
}

export const Single: Story = {
  render: () => {
    const Demo = () => {
      const [date, setDate] = useState<Date | undefined>()
      return (
        <div className="flex w-72 flex-col gap-2">
          <Label htmlFor="date">Election day</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {date ? formatDate(date) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }
    return <Demo />
  },
}

export const Range: Story = {
  render: () => {
    const Demo = () => {
      const [range, setRange] = useState<
        { from: Date | undefined; to?: Date | undefined } | undefined
      >()
      const label = range?.from
        ? range.to
          ? `${formatDate(range.from)} – ${formatDate(range.to)}`
          : formatDate(range.from)
        : 'Pick a date range'
      return (
        <div className="flex w-96 flex-col gap-2">
          <Label htmlFor="range">Campaign window</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="range"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !range?.from && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }
    return <Demo />
  },
}
