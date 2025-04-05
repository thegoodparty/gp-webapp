'use client'
import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import { FaCheck } from 'react-icons/fa'
import AcknowledgementTitleBar from '@shared/acknowledgements/AcknowledgementTitleBar'
import { AcknowledgementQuestionBody } from '@shared/acknowledgements/AcknowledgementQuestionBody'
import { useEffect, useRef, useState } from 'react'
import Button from '@shared/buttons/Button'

export const AcknowledgementQuestion = ({
  emoticon = <></>,
  title,
  body,
  buttonTexts = ['I Agree', 'Agreed'],
  show = false,
  acknowledged = false,
  onAcknowledge = () => {},
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
      <AcknowledgementTitleBar {...{ emoticon, title, ref: titleBarRef }} />
      <AcknowledgementQuestionBody {...{ show }}>
        <CmsContentWrapper>{body}</CmsContentWrapper>

        <div className="flex justify-center mt-8">
          {acknowledged ? (
            <Button
              onClick={() => {
                onAcknowledge(false)
              }}
              className="flex items-center"
              size="large"
              color="success"
            >
              <FaCheck />
              <div className="ml-2">{buttonTexts[1]}</div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                onAcknowledge(true)
              }}
              size="large"
            >
              {buttonTexts[0]}
            </Button>
          )}
        </div>
      </AcknowledgementQuestionBody>
    </>
  )
}
