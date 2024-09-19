export const COLOR_CLASSES = {
  primary:
    'text-primary-contrast bg-primary-main hover:[&:not([disabled])]:bg-primary-dark focus:active:outline-primary-main/30',
  secondary:
    'text-secondary-contrast bg-secondary-main hover:[&:not([disabled])]:bg-secondary-dark focus:active:outline-secondary-dark/40',
  tertiary:
    'text-tertiary-contrast bg-tertiary-main hover:[&:not([disabled])]:bg-tertiary-dark focus:active:outline-tertiary-dark/30',
  error:
    'text-error-contrast bg-error-main hover:[&:not([disabled])]:bg-error-dark focus:active:outline-error-main/30',
  warning:
    'text-warning-contrast bg-warning-main hover:[&:not([disabled])]:bg-warning-dark focus:active:outline-warning-main/30',
  info: 'text-info-contrast bg-info-main hover:[&:not([disabled])]:bg-info-dark focus:active:outline-info-main/30',
  success:
    'text-success-contrast bg-success-main hover:[&:not([disabled])]:bg-success-dark focus:active:outline-success-main/30',
  neutral:
    'text-neutral-contrast bg-neutral-light hover:[&:not([disabled])]:bg-neutral-main focus:active:outline-neutral-main/40',
};

const OUTLINED_COLOR_CLASSES = {
  primary:
    'text-primary-dark !border-primary-main/50 hover:[&:not([disabled])]:bg-primary-main/[0.08] focus:active:!bg-primary-main/[0.12]',
  secondary:
    'text-lime-900 !border-secondary-dark/50 hover:[&:not([disabled])]:bg-secondary-main/[0.16] focus:active:!bg-secondary-main/[0.24]',
  tertiary:
    'text-tertiary-dark !border-tertiary-main/50 hover:[&:not([disabled])]:bg-tertiary-main/[0.08] focus:active:!bg-tertiary-main/[0.12]',
  error:
    'text-error-dark !border-error-main/50 hover:[&:not([disabled])]:bg-error-main/[0.08] focus:active:!bg-error-main/[0.12]',
  warning:
    'text-orange-700 !border-warning-main/50 hover:[&:not([disabled])]:bg-warning-main/[0.08] focus:active:!bg-warning-main/[0.12]',
  info: 'text-info-dark !border-info-main/50 hover:[&:not([disabled])]:bg-info-main/[0.08] focus:active:!bg-info-main/[0.12]',
  success:
    'text-success-dark !border-success-main/50 hover:[&:not([disabled])]:bg-success-main/[0.08] focus:active:!bg-success-main/[0.12]',
  neutral:
    'text-neutral-dark !border-neutral-main/60 hover:[&:not([disabled])]:bg-neutral-main/[0.16] focus:active:!bg-neutral-main/[0.24]',
};

const TEXT_COLOR_CLASSES = {
  primary:
    'text-primary-dark hover:[&:not([disabled])]:bg-primary-main/[0.08] focus:active:!bg-primary-main/[0.12]',
  secondary:
    'text-lime-900 hover:[&:not([disabled])]:bg-secondary-main/[0.16] focus:active:!bg-secondary-main/[0.24]',
  tertiary:
    'text-tertiary-dark hover:[&:not([disabled])]:bg-tertiary-main/[0.08] focus:active:!bg-tertiary-main/[0.12]',
  error:
    'text-error-dark hover:[&:not([disabled])]:bg-error-main/[0.08] focus:active:!bg-error-main/[0.12]',
  warning:
    'text-orange-700 hover:[&:not([disabled])]:bg-warning-main/[0.08] focus:active:!bg-warning-main/[0.12]',
  info: 'text-info-dark hover:[&:not([disabled])]:bg-info-main/[0.08] focus:active:!bg-info-main/[0.12]',
  success:
    'text-success-dark hover:[&:not([disabled])]:bg-success-main/[0.08] focus:active:!bg-success-main/[0.12]',
  neutral:
    'text-neutral-dark hover:[&:not([disabled])]:bg-neutral-main/[0.16] focus:active:!bg-neutral-main/[0.24]',
};

export const VARIANT_CLASSES = {
  contained: COLOR_CLASSES,
  outlined: OUTLINED_COLOR_CLASSES,
  text: TEXT_COLOR_CLASSES,
};

export const SIZE_CLASSES = {
  small: 'text-xs py-2 px-3',
  medium: 'text-sm py-[10px] px-4',
  large: 'py-3 px-6 leading-6',
};

/**
 * @typedef {Object} ButtonProps
 * @property {keyof SIZE_CLASSES} size Size of the button
 * @property {keyof VARIANT_CLASSES} variant Style variant of the button
 * @property {keyof COLOR_CLASSES} color Color theme for the button
 * @property {string} className Extra classes to add to button element
 * @property {...unknown} restProps Any more props to pass to button element
 */

/**
 * Component for all button variants/colors
 *
 * @param {ButtonProps} props
 * @example
 * <Button
 *   size='small'
 *   variant='outlined'
 *   color='tertiary'
 *   className='mt-4'
 *   onClick={callbackFn}>
 *   Click Here
 * </Button>
 */

export default function Button({
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  children,
  className,
  ...restProps
}) {
  let baseClasses =
    'rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed';

  if (variant !== 'text') baseClasses += ' border-2 border-transparent ';

  if (variant === 'contained')
    baseClasses += ' outline outline-4 outline-transparent';

  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.contained;
  const colorClasses = variantClasses[color] || variantClasses.primary;
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.medium;

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${
        className || ''
      }`}
      {...restProps}
    >
      {children}
    </button>
  );
}
