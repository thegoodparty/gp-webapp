export default function H1({ children, className = '' }) {
  return (
    <h1 className={`font-medium text-4xl text-[32px] ${className}`}>
      {children}
    </h1>
  );
}
