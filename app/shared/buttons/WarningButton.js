import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import { setSize } from './PrimaryButton';

export default function WarningButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,
    'transition-colors': true,
  };
  if (variant === 'contained') {
    baseClass['bg-lime-400'] = true;
    baseClass['text-primary'] = true;
    baseClass['hover:bg-lime-500'] = true;
    baseClass['active:bg-lime-500'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-primary'] = true;
    baseClass['border-2'] = true;
    baseClass['border-yellow-700'] = true;
    baseClass['hover:border-yellow-600'] = true;
    baseClass['hover:bg-yellow-600'] = true;
    baseClass['active:bg-yellow-600'] = true;
  } else if (variant === 'text') {
    baseClass['text-lime-900'] = true;
    baseClass['hover:bg-lime-400'] = true;
    baseClass['active:bg-lime-400'] = true;
    baseClass['hover:text-primary'] = true;
    baseClass['active:text-primary'] = true;
  }
  setSize(baseClass, size);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    if (variant === 'contained') {
      baseClass['bg-lime-100'] = true;
      baseClass['text-gray-700'] = true;

      baseClass['bg-lime-400'] = false;
      baseClass['text-primary'] = false;
      baseClass['hover:bg-lime-500'] = false;
      baseClass['active:bg-lime-500'] = false;
    } else if (variant === 'outlined') {
      baseClass['bg-white'] = true;
      baseClass['text-gray-500'] = true;
      baseClass['border-yellow-100'] = true;

      baseClass['text-primary'] = false;
      baseClass['border-yellow-700'] = false;
      baseClass['hover:border-yellow-600'] = false;
      baseClass['hover:bg-yellow-600'] = false;
      baseClass['active:bg-yellow-600'] = false;
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true;

      baseClass['text-lime-900'] = false;
      baseClass['hover:bg-lime-400'] = false;
      baseClass['active:bg-lime-400'] = false;
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
      className={classNames({ ...baseClass, ...className })}
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
