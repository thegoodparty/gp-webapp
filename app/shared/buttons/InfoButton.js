import clsx from 'clsx';
import ButtonLoading from './ButtonLoading';
import { setSize } from './PrimaryButton';

export default function InfoButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth,
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
    baseClass['bg-slate-400'] = true;
    baseClass['text-indigo-900'] = true;
    baseClass['hover:bg-slate-500'] = true;
    baseClass['active:bg-slate-500'] = true;
  } else if (variant === 'outlined') {
    baseClass['bg-white'] = true;
    baseClass['text-indigo-900'] = true;
    baseClass['border-2'] = true;
    baseClass['border-slate-900'] = true;

    baseClass['hover:border-primary'] = true;
    baseClass['active:border-primary'] = true;
    baseClass['hover:bg-primary-dark'] = true;
    baseClass['active:bg-primary-dark'] = true;
    baseClass['hover:text-slate-50'] = true;
    baseClass['active:text-slate-50'] = true;
  } else if (variant === 'text') {
    baseClass['text-indigo-300'] = true;
    baseClass['hover:bg-slate-400'] = true;
    baseClass['active:bg-slate-400'] = true;
    baseClass['hover:text-primary'] = true;
    baseClass['active:text-primary'] = true;
  }
  setSize(baseClass, size);
  if (disabled) {
    baseClass['cursor-not-allowed'] = true;
    if (variant === 'contained') {
      baseClass['bg-slate-200'] = true;
      baseClass['text-gray-700'] = true;

      baseClass['bg-slate-400'] = false;
      baseClass['text-indigo-900'] = false;
      baseClass['hover:bg-slate-500'] = false;
      baseClass['active:bg-slate-500'] = false;
    } else if (variant === 'outlined') {
      baseClass['text-gray-500'] = true;
      baseClass['border-slate-200'] = true;

      baseClass['text-indigo-900'] = false;
      baseClass['border-slate-900'] = false;
      baseClass['hover:border-primary'] = false;
      baseClass['active:border-primary'] = false;
      baseClass['hover:bg-primary-dark'] = false;
      baseClass['active:bg-primary-dark'] = false;
      baseClass['hover:text-slate-50'] = false;
      baseClass['active:text-slate-50'] = false;
    } else if (variant === 'text') {
      baseClass['text-gray-500'] = true;

      baseClass['text-indigo-300'] = false;
      baseClass['hover:bg-slate-400'] = false;
      baseClass['active:bg-slate-400'] = false;
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
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  );
}
