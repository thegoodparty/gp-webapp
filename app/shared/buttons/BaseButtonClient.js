'use client';
const BaseButton = ({
  children,
  style,
  onClick = () => {},
  disabled = false,
  type = 'button',
  className = ''
}) => {
  return (
    <button
      className={`py-5 px-8 rounded-lg ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default BaseButton;
