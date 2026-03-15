'use client'

import React, { useState } from 'react'
import { Input, Calendar } from '@styleguide'
import { DayPickerProps } from 'react-day-picker'
import { parse, format, isValid } from 'date-fns'

const formatDateInput = (value: string): string => {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')

  if (digits.length >= 5) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  } else if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
  } else if (digits.length >= 1) {
    return digits.slice(0, 2)
  }
  return digits
}

const parseDateFromString = (dateString: string): Date | undefined => {
  if (!dateString || dateString.length !== 10) return undefined

  try {
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date())

    if (isValid(parsedDate)) {
      return parsedDate
    }
  } catch (error) {
    console.log('Date parsing error:', error)
  }

  return undefined
}

const formatDateToString = (date: Date | undefined): string => {
  if (!date || !isValid(date)) return ''

  return format(date, 'MM/dd/yyyy')
}

type DateInputCalendarProps = Omit<
  DayPickerProps,
  'month' | 'selected' | 'onSelect' | 'onMonthChange' | 'mode'
> & {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
  className?: string
  inputClassName?: string
  calendarClassName?: string
  showTextInput?: boolean
}

const DateInputCalendar = ({
  value,
  onChange,
  placeholder = 'mm/dd/yyyy',
  label = 'Select Date',
  captionLayout = 'dropdown',
  className = '',
  inputClassName = '',
  calendarClassName = 'rounded-lg border shadow-sm',
  showTextInput,
  ...calendarProps
}: DateInputCalendarProps): React.JSX.Element => {
  const [inputValue, setInputValue] = useState(
    value ? formatDateToString(value) : '',
  )
  const [month, setMonth] = useState(value || new Date())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value)
    setInputValue(formatted)

    const parsedDate = parseDateFromString(formatted)
    if (parsedDate) {
      setMonth(parsedDate)
      onChange?.(parsedDate)
    }
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate)
    if (selectedDate) {
      setInputValue(formatDateToString(selectedDate))
    } else {
      setInputValue('')
    }
  }

  React.useEffect(() => {
    if (value) {
      setInputValue(formatDateToString(value))
      setMonth(value)
    } else {
      setInputValue('')
    }
  }, [value])

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      {showTextInput && (
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="date-input" className="text-sm font-normal">
            {label}
          </label>
          <Input
            type="text"
            placeholder={placeholder}
            id="date-input"
            value={inputValue}
            onChange={handleInputChange}
            className={inputClassName}
          />
        </div>
      )}
      <Calendar
        mode="single"
        month={month}
        selected={value}
        onSelect={handleCalendarSelect}
        onMonthChange={setMonth}
        captionLayout={captionLayout}
        className={calendarClassName}
        {...calendarProps}
      />
    </div>
  )
}

export default DateInputCalendar
