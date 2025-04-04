'use client';
import ButtonLoading from './ButtonLoading';
import { setSize } from './PrimaryButton';
import { buttonOnClickHandler } from '@shared/buttons/buttonOnClickHandler';
import { compileButtonClassName } from '@shared/buttons/compileButtonClassName';

export default function SecondaryButton({
  children,
  className = {},
  variant = 'contained',
  style = {},
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  ariaLabel,
  onClick,
  ...restProps
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
    baseClass['bg-slate-300'] = true;
    baseClass['border-2'] = true;
    baseClass['border-slate-300'] = true;
    baseClass['text-primary'] = true;
    baseClass['hover:bg-lime-400'] = true;
    baseClass['active:bg-lime-400'] = true;
  } else if (variant === 'outlined') {
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
      className={compileButtonClassName(baseClass, className)}
      style={style}
      disabled={disabled}
      aria-label={ariaLabel}
      {...restProps}
      onClick={buttonOnClickHandler(onClick)}
    >
      {loading ? <ButtonLoading /> : null}
      {children}
    </button>
  );
}
