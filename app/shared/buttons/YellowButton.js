'use client';

import BaseButton from './BaseButton';

const YellowButton = ({ children, onClick = () => {}, style = {} }) => {
  return (
    <BaseButton
      onClick={onClick}
      style={{ ...style, backgroundColor: '#FFE600', color: '#000' }}
    >
      {children}
    </BaseButton>
  );
};

export default YellowButton;
