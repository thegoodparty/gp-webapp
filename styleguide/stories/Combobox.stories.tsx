import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import { useState } from 'react'
import { Combobox } from '../components/ui/combobox'

type Office = {
  value: string
  label: string
  branch: string
}

const offices: Office[] = [
  { value: 'mayor', label: 'Mayor', branch: 'Local' },
  { value: 'city-council', label: 'City Council', branch: 'Local' },
  { value: 'school-board', label: 'School Board', branch: 'Local' },
  { value: 'state-senate', label: 'State Senate', branch: 'State' },
  { value: 'state-house', label: 'State House', branch: 'State' },
  { value: 'us-house', label: 'US House', branch: 'Federal' },
  { value: 'us-senate', label: 'US Senate', branch: 'Federal' },
]

const meta: Meta<typeof Combobox<Office>> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable single-select built on `Popover` (open/close), `Command` (filterable list with keyboard nav) and a button trigger. Generic over the option type — pass `getOptionLabel` to render labels and `groupBy` to render grouped sections.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox<Office>>

type PlaygroundArgs = {
  value: string
  disabled: boolean
  clearable: boolean
  placeholder: string
  searchPlaceholder: string
  emptyText: string
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    value: '',
    disabled: false,
    clearable: true,
    placeholder: 'Select an office',
    searchPlaceholder: 'Search offices...',
    emptyText: 'No office found',
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['', ...offices.map((o) => o.value)],
      description: 'Controlled selection. Empty string means nothing selected.',
    },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    emptyText: { control: 'text' },
  },
  render: ({
    value,
    disabled,
    clearable,
    placeholder,
    searchPlaceholder,
    emptyText,
  }) => {
    const [, updateArgs] = useArgs()
    const selected = offices.find((o) => o.value === value) ?? null
    return (
      <div className="w-64">
        <Combobox
          options={offices}
          value={selected}
          onChange={(next) => updateArgs({ value: next ? next.value : '' })}
          getOptionLabel={(o) => o.label}
          getOptionKey={(o) => o.value}
          disabled={disabled}
          clearable={clearable}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<Office | null>(null)
      return (
        <div className="w-64">
          <Combobox
            options={offices}
            value={value}
            onChange={setValue}
            getOptionLabel={(o) => o.label}
            getOptionKey={(o) => o.value}
            placeholder="Select an office"
            searchPlaceholder="Search offices..."
          />
        </div>
      )
    }
    return <Demo />
  },
}

export const Grouped: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<Office | null>(null)
      return (
        <div className="w-64">
          <Combobox
            options={offices}
            value={value}
            onChange={setValue}
            getOptionLabel={(o) => o.label}
            getOptionKey={(o) => o.value}
            groupBy={(o) => o.branch}
            placeholder="Select an office"
            searchPlaceholder="Search offices..."
          />
        </div>
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Combobox
        options={offices}
        value={null}
        onChange={() => undefined}
        getOptionLabel={(o) => o.label}
        getOptionKey={(o) => o.value}
        disabled
        placeholder="Select an office"
      />
    </div>
  ),
}

export const Preselected: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<Office | null>(offices[3] ?? null)
      return (
        <div className="w-64">
          <Combobox
            options={offices}
            value={value}
            onChange={setValue}
            getOptionLabel={(o) => o.label}
            getOptionKey={(o) => o.value}
            placeholder="Select an office"
            searchPlaceholder="Search offices..."
          />
        </div>
      )
    }
    return <Demo />
  },
}
