import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { setSize } from './PrimaryButton';

export default function SuccessButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  };

  if (fullWidth) {
    baseClass['w-full'] = true;
  }
  if (variant === 'contained') {
    baseClass['bg-green-400'] = true;
    baseClass['text-indigo-900'] = true;
    baseClass['hover:bg-green-300'] = true;
    baseClass['active:bg-green-300'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-indigo-900'] = true;
    baseClass['border-2'] = true;
    baseClass['border-green-400'] = true;
    baseClass['hover:bg-green-400'] = true;
    baseClass['active:bg-green-400'] = true;
  } else if (variant === 'text') {
    baseClass['text-green-500'] = true;
    baseClass['hover:bg-green-300'] = true;
    baseClass['active:bg-green-300'] = true;
    baseClass['hover:text-primary'] = true;
    baseClass['active:text-primary'] = true;
  }
  setSize(baseClass, size);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    if (variant === 'contained') {
      baseClass['bg-green-50'] = true;
      baseClass['text-gray-700'] = true;

      baseClass['bg-green-400'] = false;
      baseClass['text-indigo-900'] = false;
      baseClass['hover:bg-green-300'] = false;
      baseClass['active:bg-green-300'] = false;
    } else if (variant === 'outlined') {
      baseClass['text-gray-500'] = true;
      baseClass['border-green-50'] = true;

      baseClass['text-indigo-900'] = false;
      baseClass['border-green-400'] = false;
      baseClass['hover:bg-green-400'] = false;
      baseClass['active:bg-green-400'] = false;
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true;

      baseClass['text-green-500'] = false;
      baseClass['hover:bg-green-300'] = false;
      baseClass['active:bg-green-300'] = false;
      baseClass['hover:text-primary'] = false;
      baseClass['active:text-primary'] = false;
    }
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
    >
      {loading ? (
        <CircularProgress size={16} className="mr-2" color="inherit" />
      ) : null}
      {children}
    </button>
  );
}
