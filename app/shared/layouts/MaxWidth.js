export default function MaxWidth({ children, smallFull = false }) {
  return (
    <div
      className={`max-w-screen-xl mx-auto ${
        smallFull ? 'px-0' : 'px-4'
      } xl:p-0`}
    >
      {children}
    </div>
  );
}
