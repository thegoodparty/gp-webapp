'use client';
const BaseButton = ({
  children,
  style,
  onClick = () => {},
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      className="py-5 px-8 rounded-lg"
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
