import { useEffect, useRef, useState } from 'react'
import AcknowledgementTitleBar from '@shared/acknowledgements/AcknowledgementTitleBar'
import { MdTask } from 'react-icons/md'
import { AcknowledgementQuestionBody } from '@shared/acknowledgements/AcknowledgementQuestionBody'
import { ErrorAlert } from '@shared/alerts/ErrorAlert'
import TextField from '@shared/inputs/TextField'

export const ServiceAgreementSignatureSection = ({
  show,
  signature,
  onChange = () => {},
  disableScrollTo = false,
}) => {
  const [scrolledTo, setScrolledTo] = useState(disableScrollTo)
  const titleBarRef = useRef(null)

  useEffect(() => {
    if (show && !scrolledTo && titleBarRef.current) {
      titleBarRef.current.scrollIntoView({ behavior: 'smooth' })
      setScrolledTo(true)
    }
  }, [show])
  return (
    <>
      <AcknowledgementTitleBar
        {...{
          title: 'Sign',
          emoticon: <MdTask className="mr-2" />,
          ref: titleBarRef,
        }}
      />
      <AcknowledgementQuestionBody show={show} className="mb-12">
        <ErrorAlert className="mb-6">
          By signing you agree to the above and understand that providing false
          information will result in termination of your Pro subscription,
          forfeiture of any fees paid, and potential legal action for fraud.
        </ErrorAlert>
        <TextField
          value={signature}
          onChange={onChange}
          className="w-full"
          InputLabelProps={{ shrink: true }}
          label={
            <span>
              <span className="text-black">Signature</span>
              <span className="!text-gray-400 mx-1">*</span>
              <span className="!text-gray-400">Required</span>
            </span>
          }
          placeholder="Jane Doe"
        />
      </AcknowledgementQuestionBody>
    </>
  )
}
