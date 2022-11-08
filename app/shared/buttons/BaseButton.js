'use client';
const BaseButton = ({ children, onClick = () => {}, style }) => {
  return (
    <button onClick={onClick} className="py-3 px-8 rounded-lg" style={style}>
      {children}
    </button>
  );
};

export default BaseButton;
