export default function H2({ children, className = '', ...rest }) {
  return (
    <div
      className={` font-sfpro text-xs uppercase tracking-wider ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
