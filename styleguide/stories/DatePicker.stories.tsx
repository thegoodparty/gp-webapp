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
