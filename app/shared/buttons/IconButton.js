import clsx from 'clsx'

export const COLOR_CLASSES = {
  primary:
    'text-primary-dark hover:bg-indigo-700/[0.08] focus-visible:bg-indigo-700/[0.3] active:bg-indigo-700/[0.3]',
  secondary:
    'text-secondary-dark hover:bg-lime-500/[0.16] focus-visible:bg-lime-700/[0.4] active:bg-lime-700/[0.4]',
  tertiary:
    'text-tertiary-dark hover:bg-purple-500/[0.08] focus-visible:bg-purple-500/[0.3] active:bg-purple-500/[0.3]',
  error:
    'text-error-dark hover:bg-red-500/[0.08] focus-visible:bg-red-500/[0.3] active:bg-red-500/[0.3]',
  warning:
    'text-warning-dark hover:bg-orange-500/[0.08] focus-visible:bg-orange-500/[0.3] active:bg-orange-500/[0.3]',
  info: 'text-info-dark hover:bg-blue-500/[0.08] focus-visible:bg-blue-500/[0.3] active:bg-blue-500/[0.3]',
  success:
    'text-success-dark hover:bg-green-500/[0.08] focus-visible:bg-green-500/[0.3] active:bg-green-500/[0.3]',
  neutral:
    'text-neutral-dark hover:bg-indigo-300/[0.16] focus-visible:bg-indigo-300/[0.4] active:bg-indigo-300/[0.4]',
}

export const SIZE_CLASSES = {
  small: 'p-1',
  medium: 'p-2 ',
  large: 'p-3',
}

const BASE_CLASSES =
  'rounded-full text-3xl text-center bg-transparent disabled:opacity-50 disabled:hover:bg-transparent'

/**
 * @typedef {Object} IconButtonProps
 * @property {keyof SIZE_CLASSES} size Size of the button
 * @property {keyof COLOR_CLASSES} color Color theme for the button
 * @property {string} className Extra classes to add to button element
 * @property {...unknown} restProps Any more props to pass to button element
 */

/**
 * Component for icon only buttons
 *
 * @param {IconButtonProps} props
 * @example
 * // Must pass desired icon component as a child
 * <IconButton size="small" color='neutral' onClick={callbackFn}>
 *   <MdChevronRight />
 * </IconButton>
 */

export default function IconButton({
  size = 'medium',
  color = 'primary',
  children,
  className,
  ...restProps
}) {
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.medium
  const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.primary

  return (
    <button
      className={clsx(BASE_CLASSES, sizeClasses, colorClasses, className)}
      {...restProps}
    >
      {children}
    </button>
  )
}
