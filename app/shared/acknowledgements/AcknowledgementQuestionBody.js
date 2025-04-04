export const AcknowledgementQuestionBody = ({
  children,
  className = '',
  show,
}) => (
  <div className={`px-6 pb-10 ${show ? 'block' : 'hidden'} ${className}`}>
    {children}
  </div>
)
