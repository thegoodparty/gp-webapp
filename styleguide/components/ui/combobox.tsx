'use client'

import * as React from 'react'

import { cn } from '@styleguide/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
  SearchIcon,
  XMarkIcon,
} from './icons'

interface ComboboxProps<T> {
  options: T[]
  value: T | null
  onChange: (value: T | null) => void
  getOptionLabel: (option: T) => string
  getOptionKey?: (option: T) => string
  onInputChange?: (text: string) => void
  inputValue?: string
  groupBy?: (option: T) => string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disableClientFilter?: boolean
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
  id?: string
}

const Combobox = <T,>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionKey,
  onInputChange,
  inputValue,
  groupBy,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  emptyText = 'No results',
  disableClientFilter = false,
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  clearable = true,
  className,
  id,
}: ComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const [commandValue, setCommandValue] = React.useState('')
  const contentId = React.useId()

  const keyFor = getOptionKey ?? getOptionLabel

  const grouped = React.useMemo(() => {
    if (!groupBy) return null
    const map = new Map<string, T[]>()
    for (const option of options) {
      const group = groupBy(option)
      const existing = map.get(group)
      if (existing) {
        existing.push(option)
      } else {
        map.set(group, [option])
      }
    }
    return Array.from(map.entries())
  }, [options, groupBy])

  const selectedLabel = value !== null ? getOptionLabel(value) : null

  React.useEffect(() => {
    if (open) {
      setCommandValue(selectedLabel ?? '')
    }
  }, [open, selectedLabel])

  const renderItem = (option: T) => {
    const isSelected = value !== null && keyFor(option) === keyFor(value)
    return (
      <CommandItem
        key={keyFor(option)}
        value={getOptionLabel(option)}
        onSelect={() => {
          onChange(option)
          setOpen(false)
        }}
      >
        {getOptionLabel(option)}
        <CheckIcon
          className={cn(
            'ml-auto size-4',
            isSelected ? 'opacity-100' : 'opacity-0',
          )}
        />
      </CommandItem>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={contentId}
          disabled={disabled}
          data-slot="combobox-trigger"
          className={cn(
            "border-base-border focus-visible:border-ring focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            className,
          )}
        >
          <SearchIcon className="opacity-50" />
          <span
            className={cn(
              'flex-1 truncate text-left',
              selectedLabel === null && 'text-muted-foreground',
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          {clearable && value !== null ? (
            <span
              role="button"
              aria-label="Clear selection"
              tabIndex={-1}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onChange(null)
              }}
              className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center"
            >
              <XMarkIcon className="size-4" />
            </span>
          ) : (
            <ChevronsUpDownIcon className="opacity-50" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        className="w-(--radix-popover-trigger-width) p-0"
        aria-label={placeholder}
      >
        <Command
          shouldFilter={!disableClientFilter}
          value={commandValue}
          onValueChange={setCommandValue}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onInputChange}
            {...(inputValue !== undefined ? { value: inputValue } : {})}
          />
          <CommandList>
            {loading ? (
              <div className="text-muted-foreground flex items-center gap-2 px-3 py-6 text-sm justify-center">
                <LoaderCircleIcon className="size-4 animate-spin" />
                {loadingText}
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                {grouped
                  ? grouped.map(([group, groupOptions]) => (
                      <CommandGroup key={group} heading={group}>
                        {groupOptions.map(renderItem)}
                      </CommandGroup>
                    ))
                  : options.map(renderItem)}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox, type ComboboxProps }
