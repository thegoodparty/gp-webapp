export const COLOR_CLASSES = {
  primary:
    'text-primary-dark hover:bg-indigo-700/[0.08] focus:active:bg-indigo-700/[0.3]',
  secondary:
    'text-secondary-dark hover:bg-lime-500/[0.16] focus:active:bg-lime-700/[0.4]',
  tertiary:
    'text-tertiary-dark hover:bg-purple-500/[0.08] focus:active:bg-purple-500/[0.3]',
  error:
    'text-error-dark hover:bg-red-500/[0.08] focus:active:bg-red-500/[0.3]',
  warning:
    'text-warning-dark hover:bg-orange-500/[0.08] focus:active:bg-orange-500/[0.3]',
  info: 'text-info-dark hover:bg-blue-500/[0.08] focus:active:bg-blue-500/[0.3]',
  success:
    'text-success-dark hover:bg-green-500/[0.08] focus:active:bg-green-500/[0.3]',
  neutral:
    'text-neutral-dark hover:bg-indigo-300/[0.16] focus:active:bg-indigo-300/[0.4]',
};

export const SIZE_CLASSES = {
  small: 'p-1',
  medium: 'p-2 ',
  large: 'p-3',
};

const BASE_CLASSES =
  'rounded-[100%] text-3xl text-center bg-white disabled:opacity-50 disabled:hover:bg-white';

/**
 * @typedef {Object} IconButtonProps
 * @property {keyof SIZE_CLASSES} size Size of the button
 * @property {keyof COLOR_CLASSES} color Color style for the button
 * @property {boolean} disabled Disable the button
 * @property {string} className Extra classes to add to button element
 */

/**
 * Component for icon only buttons
 *
 * @param {IconButtonProps} props
 * @example
 * // Must pass desired icon component as a child
 * <IconButton size="small" color='neutral'>
 *   <MdChevronRight />
 * </IconButton>
 */

export default function IconButton({
  size = 'medium',
  color = 'primary',
  disabled = false,
  children,
  className,
}) {
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.medium;
  const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.primary;

  return (
    <button
      className={`${BASE_CLASSES} ${sizeClasses} ${colorClasses} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
