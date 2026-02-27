interface QuestionFeedbackProps {
  warningMessage: string | null
  errorMessage?: string
}

export function QuestionFeedback({
  warningMessage,
  errorMessage,
}: QuestionFeedbackProps) {
  if (errorMessage) {
    return <p className="mt-1 font-normal text-sm text-error">{errorMessage}</p>
  }

  return (
    <p
      className={`mt-1 font-normal text-sm ${
        warningMessage ? 'text-warning-dark' : 'text-muted-foreground'
      }`}
    >
      {warningMessage ||
        'We recommend checking your message for clarity and bias using optimize message.'}
    </p>
  )
}
