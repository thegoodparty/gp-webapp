import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

export default function PrimaryButton({
  children,
  className = '',
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
}) {
  let baseClass = {
    'rounded-lg': true,
    'font-medium': true,
    'hover:text-lime-500': true,
    'active:text-lime-500': true,
    'transition-colors': true,
  };
  if (variant === 'contained') {
    baseClass['bg-primary'] = true;
    baseClass['text-slate-50'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-primary'] = true;
    baseClass['border-2'] = true;
    baseClass['border-primary'] = true;
  } else if (variant === 'text') {
    baseClass['text-primary'] = true;
  }
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
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    baseClass['bg-gray-600'] = true;
    baseClass['text-gray-300'] = true;
    baseClass['hover:text-gray-300'] = true;
    baseClass['hover:text-lime-500'] = false;
    baseClass['active:text-lime-500'] = false;
    baseClass['bg-white'] = false;
    baseClass['bg-primary'] = false;
  }

  if (loading) {
    baseClass.flex = true;
    baseClass['items-center'] = true;
  }

  return (
    <button
      className={classNames(baseClass, className)}
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
