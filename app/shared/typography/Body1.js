export default function Body1({ children, className = '', style = {} }) {
  return (
    <div className={`font-normal text-base ${className}`} style={style}>
      {children}
    </div>
  );
}
