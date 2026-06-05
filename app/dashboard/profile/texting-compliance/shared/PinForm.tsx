'use client'

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react'
import { Button } from '@styleguide'
import {
  PinChannel,
  formatPinChannels,
} from 'app/dashboard/profile/texting-compliance/shared/pinChannels'

const PIN_LENGTH = 6

const emptyDigits = (): string[] => Array(PIN_LENGTH).fill('')

const buildHelperText = (channels: PinChannel[]): string => {
  const channelText = formatPinChannels(channels)
  const baseText =
    'To verify your identity you will be sent a PIN within 2-3 business days'
  if (!channelText) {
    return `${baseText} from CampaignVerify.`
  }
  // "either" implies a choice between options, so only use it when there are
  // multiple channels — with a single channel it's misleading.
  const connector = channels.length === 1 ? 'to your' : 'to either your'
  return `${baseText} ${connector} ${channelText} from CampaignVerify.`
}

interface PinFormProps {
  channels: PinChannel[]
  onSubmit: (pin: string) => void | Promise<void>
  loading?: boolean
  error?: string | null
}

export default function PinForm({
  channels,
  onSubmit,
  loading = false,
  error = null,
}: PinFormProps): React.JSX.Element {
  const [digits, setDigits] = useState<string[]>(emptyDigits)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const pin = digits.join('')
  const isComplete = pin.length === PIN_LENGTH && /^\d{6}$/.test(pin)

  const focusInput = (index: number): void => {
    const target = inputsRef.current[index]
    if (target) {
      target.focus()
      target.select()
    }
  }

  const setDigitAt = (index: number, value: string): void => {
    setDigits((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const raw = e.target.value
    // Strip any non-digit input (paste of "12 34" etc).
    const digitsOnly = raw.replace(/\D/g, '')

    if (digitsOnly.length === 0) {
      setDigitAt(index, '')
      return
    }

    // If user pasted multiple digits into one box, distribute across boxes.
    if (digitsOnly.length > 1) {
      setDigits((prev) => {
        const next = [...prev]
        for (let i = 0; i < digitsOnly.length && index + i < PIN_LENGTH; i++) {
          next[index + i] = digitsOnly.charAt(i)
        }
        return next
      })
      const lastFilled = Math.min(index + digitsOnly.length - 1, PIN_LENGTH - 1)
      const nextFocus = Math.min(lastFilled + 1, PIN_LENGTH - 1)
      focusInput(nextFocus)
      return
    }

    setDigitAt(index, digitsOnly)
    if (index < PIN_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '')
      } else if (index > 0) {
        focusInput(index - 1)
        setDigitAt(index - 1, '')
      }
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      focusInput(index + 1)
      e.preventDefault()
    }
  }

  const handlePaste = (
    index: number,
    e: ClipboardEvent<HTMLInputElement>,
  ): void => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return
    e.preventDefault()
    setDigits((prev) => {
      const next = [...prev]
      for (let i = 0; i < pasted.length && index + i < PIN_LENGTH; i++) {
        next[index + i] = pasted.charAt(i)
      }
      return next
    })
    const target = Math.min(index + pasted.length, PIN_LENGTH - 1)
    focusInput(target)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!isComplete || loading) return
    await onSubmit(pin)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <fieldset disabled={loading} className="flex flex-col gap-2 border-0 p-0">
        <legend className="mb-1 text-xs font-medium text-gray-900">PIN</legend>
        <div className="flex gap-2" role="group" aria-label="PIN digits">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              autoFocus={index === 0}
              value={digit}
              aria-label={`Digit ${index + 1}`}
              aria-invalid={Boolean(error) || undefined}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              onFocus={(e) => e.target.select()}
              className={`h-12 w-full max-w-12 flex-1 rounded-lg border bg-white text-center text-base font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">{buildHelperText(channels)}</p>
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </fieldset>
      <div className="flex justify-end">
        <Button
          type="submit"
          size="large"
          disabled={!isComplete || loading}
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
