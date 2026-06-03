'use client'

import {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  JSX,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
  useId,
} from 'react'
import { Input, Textarea, Label, cn, CircleAlertIcon } from '@styleguide'

const ADORNMENTS = {
  error: <CircleAlertIcon className="text-red size-5" />,
}

type EndAdornment = keyof typeof ADORNMENTS | JSX.Element

interface AdornmentProps {
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  ref?: Ref<HTMLInputElement>
  className?: string
  style?: CSSProperties
  onMouseDown?: (event: MouseEvent) => void
}

interface LabelShrinkProps {
  shrink?: boolean
  className?: string
}

export interface TextFieldProps<Variant = unknown> {
  value?: unknown
  defaultValue?: unknown
  onChange?: (
    event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => void
  onBlur?: (event: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => void
  onKeyDown?: (
    event: KeyboardEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => void
  onKeyPress?: (
    event: KeyboardEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => void
  onClick?: (event: MouseEvent<HTMLInputElement & HTMLTextAreaElement>) => void
  name?: string
  id?: string
  type?: string
  placeholder?: string
  label?: ReactNode
  error?: boolean
  helperText?: ReactNode
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  className?: string
  multiline?: boolean
  rows?: number
  maxRows?: number
  size?: string
  variant?: Variant
  maxLength?: number
  endAdornments?: EndAdornment[]
  InputProps?: AdornmentProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps?: Record<string, any>
  inputRef?: Ref<HTMLInputElement>
  InputLabelProps?: LabelShrinkProps
  slotProps?: { inputLabel?: LabelShrinkProps }
  style?: CSSProperties
  sx?: unknown
  key?: string
}

const TextField = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyPress,
  onClick,
  name,
  id,
  type,
  placeholder,
  label,
  error,
  helperText,
  disabled,
  required,
  autoFocus,
  className,
  multiline,
  rows,
  maxLength,
  endAdornments,
  InputProps,
  inputProps,
  inputRef,
  style,
}: TextFieldProps) => {
  const generatedId = useId()
  const inputId = id ?? name ?? generatedId

  const resolvedEndAdornments = endAdornments?.length
    ? endAdornments.map((adornment) =>
        typeof adornment === 'string' ? ADORNMENTS[adornment] : adornment,
      )
    : null

  const endAdornment = resolvedEndAdornments ?? InputProps?.endAdornment ?? null
  const startAdornment = InputProps?.startAdornment ?? null

  const resolvedMaxLength = maxLength ?? inputProps?.maxLength

  const sharedProps = {
    id: inputId,
    name,
    value: value as InputHTMLAttributes<HTMLInputElement>['value'],
    defaultValue:
      defaultValue as InputHTMLAttributes<HTMLInputElement>['defaultValue'],
    placeholder,
    disabled,
    required,
    autoFocus,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyPress,
    onClick,
    style,
    'aria-invalid': error ? true : undefined,
    maxLength: resolvedMaxLength,
  }

  const control = multiline ? (
    <Textarea
      {...sharedProps}
      rows={rows}
      ref={inputRef as Ref<HTMLTextAreaElement>}
      className={cn(error && 'border-destructive', className)}
      {...inputProps}
    />
  ) : (
    <Input
      {...sharedProps}
      type={type}
      ref={inputRef ?? InputProps?.ref}
      className={cn(error && 'border-destructive', className)}
      {...inputProps}
    />
  )

  const adorned =
    startAdornment || endAdornment ? (
      <div className="relative flex w-full items-center">
        {startAdornment ? (
          <span className="absolute left-3 flex items-center">
            {startAdornment}
          </span>
        ) : null}
        {control}
        {endAdornment ? (
          <span className="absolute right-3 flex items-center">
            {endAdornment}
          </span>
        ) : null}
      </div>
    ) : (
      control
    )

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      {adorned}
      {helperText ? (
        <div className={cn('text-sm', error ? 'text-red' : 'text-gray-500')}>
          {helperText}
        </div>
      ) : null}
    </div>
  )
}

export default TextField
