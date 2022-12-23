const BaseButton = ({ children, style }) => {
  return (
    <button className="py-5 px-8 rounded-lg" style={style}>
      {children}
    </button>
  );
};

export default BaseButton;
