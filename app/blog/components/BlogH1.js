export default function BlogH1({ children, className }) {
  return (
    <h1 className={`font-semibold my-2 text-6xl leading-snug ${className}`}>
      {children}
    </h1>
  );
}
