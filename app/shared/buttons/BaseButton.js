const BaseButton = ({ children, style, ...props }) => {
  return (
    <button className="py-5 px-8 rounded-lg" style={style} {...props}>
      {children}
    </button>
  );
};

export default BaseButton;
