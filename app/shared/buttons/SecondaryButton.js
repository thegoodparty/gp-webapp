import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import { setSize } from './PrimaryButton';

export default function SecondaryButton({
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
    baseClass['bg-slate-300'] = true;
    baseClass['text-primary'] = true;
    baseClass['hover:bg-lime-400'] = true;
    baseClass['active:bg-lime-400'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-primary'] = true;
    baseClass['border-2'] = true;
    baseClass['border-slate-500'] = true;
    baseClass['hover:bg-lime-400'] = true;
    baseClass['active:bg-lime-400'] = true;
    baseClass['hover:border-lime-400'] = true;
    baseClass['active:border-lime-400'] = true;
  } else if (variant === 'text') {
    baseClass['text-primary'] = true;
    baseClass['hover:bg-lime-400'] = true;
    baseClass['active:bg-lime-400'] = true;
  }
  setSize(baseClass, size);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    if (variant === 'contained') {
      baseClass['bg-slate-200'] = true;
      baseClass['text-gray-700'] = true;
      baseClass['bg-slate-300'] = false;
      baseClass['text-primary'] = false;
      baseClass['hover:bg-lime-400'] = false;
      baseClass['active:bg-lime-400'] = false;
    } else if (variant === 'outlined') {
      baseClass['bg-white'] = true;
      baseClass['text-gray-500'] = true;
      baseClass['border-gray-200'] = true;

      baseClass['text-primary'] = false;
      baseClass['border-slate-500'] = false;
      baseClass['hover:bg-lime-400'] = false;
      baseClass['active:bg-lime-400'] = false;
      baseClass['hover:border-lime-400'] = false;
      baseClass['active:border-lime-400'] = false;
      baseClass['hover:text-primary'] = false;
      baseClass['active:text-primary'] = false;
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true;
      baseClass['text-primary'] = false;

      baseClass['hover:bg-lime-400'] = false;
      baseClass['active:bg-lime-400'] = false;
      baseClass['hover:border-lime-400'] = false;
      baseClass['active:border-lime-400'] = false;
      baseClass['hover:text-primary'] = false;
      baseClass['active:text-primary'] = false;
      baseClass['border-2'] = false;
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
