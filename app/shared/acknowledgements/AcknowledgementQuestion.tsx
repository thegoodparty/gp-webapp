'use client'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import { FaCheck } from 'react-icons/fa'
import AcknowledgementTitleBar from '@shared/acknowledgements/AcknowledgementTitleBar'
import { AcknowledgementQuestionBody } from '@shared/acknowledgements/AcknowledgementQuestionBody'
import Button from '@shared/buttons/Button'

interface AcknowledgementQuestionProps {
  emoticon?: ReactNode
  title: string
  body: ReactNode
  buttonTexts?: [string, string]
  show?: boolean
  acknowledged?: boolean
  onAcknowledge?: (acknowledged: boolean) => void
  disableScrollTo?: boolean
}

export const AcknowledgementQuestion = ({
  emoticon = <></>,
  title,
  body,
  buttonTexts = ['I Agree', 'Agreed'],
  show = false,
  acknowledged = false,
  onAcknowledge = () => {},
  disableScrollTo = false,
}: AcknowledgementQuestionProps): React.JSX.Element => {
  const [scrolledTo, setScrolledTo] = useState<boolean>(disableScrollTo)
  const titleBarRef = useRef<HTMLDivElement>(null)

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
