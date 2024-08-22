export default function Paper({ children, className, ...rest }) {
  return (
    <div
      className={`bg-white border border-slate-300 p-4 md:p-6  rounded-xl ${
        className || ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );
}
