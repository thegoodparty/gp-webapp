import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from '../components/ui/icons'
import { Button } from '../components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { cn } from '../lib/utils'

const meta: Meta = {
  title: 'Components/Combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combobox is not a standalone primitive — it is the composition of `Popover` (open/close), `Command` (filterable list with keyboard nav), and `Button` (trigger). Use this pattern for searchable single-select inputs.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const offices = [
  { value: 'mayor', label: 'Mayor' },
  { value: 'city-council', label: 'City Council' },
  { value: 'school-board', label: 'School Board' },
  { value: 'state-senate', label: 'State Senate' },
  { value: 'state-house', label: 'State House' },
  { value: 'us-house', label: 'US House' },
  { value: 'us-senate', label: 'US Senate' },
]

type PlaygroundArgs = {
  value: string
  disabled: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    value: '',
    disabled: false,
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['', ...offices.map((o) => o.value)],
      description:
        'Controlled selection. Empty string means nothing selected.',
    },
    disabled: { control: 'boolean' },
  },
  render: ({ value, disabled }) => {
    const [, updateArgs] = useArgs()
    const selected = offices.find((o) => o.value === value)
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-64 justify-between"
          >
            {selected ? selected.label : 'Select an office...'}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search offices..." />
            <CommandList>
              <CommandEmpty>No office found.</CommandEmpty>
              <CommandGroup>
                {offices.map((office) => (
                  <CommandItem
                    key={office.value}
                    value={office.value}
                    onSelect={(currentValue) => {
                      updateArgs({
                        value: currentValue === value ? '' : currentValue,
                      })
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 size-4',
                        value === office.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {office.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
}

export const Single: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false)
      const [value, setValue] = useState('')
      const selected = offices.find((o) => o.value === value)
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-64 justify-between"
            >
              {selected ? selected.label : 'Select an office...'}
              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <Command>
              <CommandInput placeholder="Search offices..." />
              <CommandList>
                <CommandEmpty>No office found.</CommandEmpty>
                <CommandGroup>
                  {offices.map((office) => (
                    <CommandItem
                      key={office.value}
                      value={office.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue)
                        setOpen(false)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 size-4',
                          value === office.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {office.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  render: () => (
    <Button
      variant="outline"
      role="combobox"
      disabled
      className="w-64 justify-between"
    >
      Select an office...
      <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
    </Button>
  ),
}
