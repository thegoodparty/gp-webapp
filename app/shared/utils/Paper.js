export default function Paper({ children, className, ...rest }) {
  return (
    <div
      className={`bg-white border border-slate-300 py-6 px-8 rounded-xl ${
        className || ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );
}
