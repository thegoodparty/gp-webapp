'use client';
import BaseButtonClient from './BaseButtonClient';

const BlackButton = ({ children, style = {}, onClick, disabled, type }) => {
  const backgroundColor = disabled ? '#333' : '#000';
  const cursor = disabled ? 'not-allowed' : 'pointer';

  return (
    <BaseButtonClient
      style={{ backgroundColor, color: '#FFF', cursor, ...style }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </BaseButtonClient>
  );
};

export default BlackButton;
