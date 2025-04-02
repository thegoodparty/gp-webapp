export const VoterContactModalWrapper = ({ children, className = '' }) => {
  return (
    <div
      className={`min-w-[80vw] lg:min-w-[740px] space-y-6 max-w-2xl mx-auto lg:px-12 lg:py-10 md:px-8 md:py-6 sm:px-4 sm:py-4 ${className}`}
    >
      {children}
    </div>
  );
}; 