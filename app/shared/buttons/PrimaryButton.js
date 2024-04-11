import clsx from 'clsx';
import ButtonLoading from './ButtonLoading';

export function setSize(baseClass, size, variant) {
  if (size === 'large') {
    baseClass['text-lg'] = true;
    baseClass['py-3'] = true;
    baseClass['px-6'] = true;
    if (variant === 'outlined') {
      baseClass['py-3'] = false;
      baseClass['py-[10px]'] = true;
    }
  } else if (size === 'medium') {
    baseClass['text-base'] = true;
    baseClass['py-2'] = true;
    baseClass['px-4'] = true;
  } else if (size === 'small') {
    baseClass['text-sm'] = true;
    baseClass['py-1'] = true;
    baseClass['px-3'] = true;
  }
}

export default function PrimaryButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ariaLabel,
  ...restProps
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,

    'transition-colors': true,
  };
  if (variant === 'contained') {
    baseClass['bg-primary'] = true;
    baseClass['text-slate-50'] = true;
    baseClass['hover:text-scondary-light'] = true;
    baseClass['active:text-scondary-light'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-primary'] = true;
    baseClass['border-2'] = true;
    baseClass['border-primary'] = true;
    baseClass['hover:text-scondary-light'] = true;
    baseClass['active:text-scondary-light'] = true;
    baseClass['hover:bg-primary'] = true;
    baseClass['active:bg-primary'] = true;
  } else if (variant === 'text') {
    baseClass['text-primary'] = true;
    baseClass['hover:text-slate-50'] = true;
    baseClass['hover:bg-primary'] = true;
    baseClass['active:bg-primary'] = true;
  }
  setSize(baseClass, size, variant);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    baseClass['bg-gray-600'] = true;
    baseClass['text-gray-300'] = true;
    baseClass['hover:text-gray-300'] = true;
    baseClass['hover:text-scondary-light'] = false;
    baseClass['active:text-scondary-light'] = false;
    baseClass['bg-white'] = false;
    baseClass['bg-primary'] = false;
    if (variant === 'outlined') {
      baseClass['border-primary'] = false;
      baseClass['border-gray-200'] = true;
      baseClass['bg-gray-600'] = false;
      baseClass['bg-white'] = true;
      baseClass['text-primary'] = false;
      baseClass['text-gray-300'] = false;
      baseClass['text-gray-500'] = true;
      baseClass['hover:text-scondary-light'] = false;
      baseClass['active:text-scondary-light'] = false;
      baseClass['hover:bg-primary'] = false;
      baseClass['active:bg-primary'] = false;
    } else if (variant === 'text') {
      baseClass['bg-gray-600'] = false;
      baseClass['bg-white'] = true;
      baseClass['text-primary'] = false;
      baseClass['text-gray-500'] = true;
      baseClass['hover:text-slate-50'] = false;
      baseClass['hover:bg-primary'] = false;
      baseClass['active:bg-primary'] = false;
    }
  }

  if (fullWidth) {
    baseClass['w-full'] = true;
  }

  if (loading) {
    baseClass.flex = true;
    baseClass['items-center'] = true;
  }

  return (
    <button
      className={clsx({ ...baseClass, ...className })}
      style={style}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      {...restProps}
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  );
}
