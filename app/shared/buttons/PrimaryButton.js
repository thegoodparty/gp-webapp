import clsx from 'clsx';
import ButtonLoading from './ButtonLoading';

export function setSize(baseClass, size) {
  if (size === 'large') {
    baseClass['text-lg'] = true;
    baseClass['py-4'] = true;
    baseClass['px-6'] = true;
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
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,

    'transition-colors': true,
  };
  if (variant === 'contained') {
    baseClass['bg-primary'] = true;
    baseClass['text-slate-50'] = true;
    baseClass['hover:text-lime-500'] = true;
    baseClass['active:text-lime-500'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-primary'] = true;
    baseClass['border-2'] = true;
    baseClass['border-primary'] = true;
    baseClass['hover:text-lime-500'] = true;
    baseClass['active:text-lime-500'] = true;
    baseClass['hover:bg-primary'] = true;
    baseClass['active:bg-primary'] = true;
  } else if (variant === 'text') {
    baseClass['text-primary'] = true;
    baseClass['hover:text-slate-50'] = true;
    baseClass['hover:bg-primary'] = true;
    baseClass['active:bg-primary'] = true;
  }
  setSize(baseClass, size);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    baseClass['bg-gray-600'] = true;
    baseClass['text-gray-300'] = true;
    baseClass['hover:text-gray-300'] = true;
    baseClass['hover:text-lime-500'] = false;
    baseClass['active:text-lime-500'] = false;
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
      baseClass['hover:text-lime-500'] = false;
      baseClass['active:text-lime-500'] = false;
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
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  );
}
