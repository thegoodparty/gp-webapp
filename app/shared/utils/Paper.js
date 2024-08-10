export default function Paper({ children, className, ...rest }) {
  return (
    <div
      className={`bg-white border border-slate-300 py-4 px-4 md:py-5 lg:py-6 lg"px-8 rounded-xl ${
        className || ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );
}
