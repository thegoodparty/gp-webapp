'use client'

import React, { useState } from 'react'
import { Input, Calendar } from 'goodparty-styleguide'
import { parse, format, isValid } from 'date-fns'

const formatDateInput = (value) => {
  if (!value) return ''
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply mm/dd/yyyy format
  if (digits.length >= 5) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  } else if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
  } else if (digits.length >= 1) {
    return digits.slice(0, 2)
  }
  return digits
}

const parseDateFromString = (dateString) => {
  if (!dateString || dateString.length !== 10) return undefined

  try {
    // Parse mm/dd/yyyy format using date-fns
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date())

    // Check if the parsed date is valid
    if (isValid(parsedDate)) {
      return parsedDate
    }
  } catch (error) {
    console.log('Date parsing error:', error)
  }

  return undefined
}

const formatDateToString = (date) => {
  if (!date || !isValid(date)) return ''

  return format(date, 'MM/dd/yyyy')
}

export default function DateInputCalendar({
  value,
  onChange,
  placeholder = 'mm/dd/yyyy',
  label = 'Select Date',
  captionLayout = 'dropdown',
  className = '',
  inputClassName = '',
  calendarClassName = 'rounded-lg border shadow-sm',
  ...calendarProps
}) {
  const [inputValue, setInputValue] = useState(
    value ? formatDateToString(value) : '',
  )
  const [month, setMonth] = useState(value || new Date())

  const handleInputChange = (e) => {
    const formatted = formatDateInput(e.target.value)
    setInputValue(formatted)

    // Try to parse the date and set it if valid
    const parsedDate = parseDateFromString(formatted)
    if (parsedDate) {
      setMonth(parsedDate) // Navigate to the month of the typed date
      onChange?.(parsedDate)
    }
  }

  const handleCalendarSelect = (selectedDate) => {
    onChange?.(selectedDate)
    if (selectedDate) {
      setInputValue(formatDateToString(selectedDate))
    } else {
      setInputValue('')
    }
  }

  // Update input value when external value changes
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
