'use client';
import BaseButtonClient from './BaseButtonClient';

export default function YellowButtonClient({
  children,
  style = {},
  onClick,
  disabled,
  type,
}) {
  const backgroundColor = disabled ? 'rgba(255, 230, 0, 0.5)' : '#FFE600';
  const cursor = disabled ? 'not-allowed' : 'pointer';

  return (
    <BaseButtonClient
      style={{ backgroundColor, color: '#000', cursor, ...style }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </BaseButtonClient>
  );
}
