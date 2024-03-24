export default function Paper({ children, ...rest }) {
  return (
    <div
      className="bg-white border border-slate-300 py-6 px-8 rounded-xl"
      {...rest}
    >
      {children}
    </div>
  );
}
