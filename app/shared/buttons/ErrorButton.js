import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import PrimaryButton from './PrimaryButton';

export default function ErrorButton({
  children,
  className = '',
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
}) {
  let baseClass = {
    'hover:bg-red-400': true,
    'active:bg-red-400': true,
    'hover:text-slate-50': true,
    'active:text-slate-50': true,
  };
  if (variant === 'contained') {
    baseClass['bg-red-500'] = true;
    baseClass['text-slate-50'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-slate-500'] = true;
    baseClass['text-indigo-900'] = true;
    baseClass['border-2'] = true;
    baseClass['border-primary'] = true;
  } else if (variant === 'text') {
    baseClass['text-primary'] = true;
  }

  if (disabled) {
    baseClass['bg-slate-200'] = true;
    baseClass['text-gray-700'] = true;
    baseClass['hover:text-gray-700'] = true;
    baseClass['hover:text-lime-500'] = false;
    baseClass['active:text-lime-500'] = false;
    baseClass['bg-white'] = false;
    baseClass['bg-red-500'] = false;
    baseClass['bg-gray-600'] = false;
    baseClass['text-gray-300'] = false;
    baseClass['hover:text-gray-300'] = false;
    baseClass['hover:bg-red-400'] = false;
    baseClass['active:bg-red-400'] = false;
  }

  return (
    <PrimaryButton
      className={classNames(baseClass, className)}
      style={style}
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
    >
      {children}
    </PrimaryButton>
  );
}
