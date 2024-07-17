'use client';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import SuccessButton from '@shared/buttons/SuccessButton';
import { FaCheck } from 'react-icons/fa';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import AcknowledgementTitleBar from '@shared/acknowledgements/AcknowledgementTitleBar';
import { AcknowledgementQuestionBody } from '@shared/acknowledgements/AcknowledgementQuestionBody';
import { useEffect, useRef, useState } from 'react';

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
  const [scrolledTo, setScrolledTo] = useState(disableScrollTo);
  const titleBarRef = useRef(null);

  useEffect(() => {
    if (show && !scrolledTo && titleBarRef.current) {
      titleBarRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrolledTo(true);
    }
  }, [show]);

  return (
    <>
      <AcknowledgementTitleBar {...{ emoticon, title, ref: titleBarRef }} />
      <AcknowledgementQuestionBody {...{ show }}>
        <CmsContentWrapper>{body}</CmsContentWrapper>

        <div className="flex justify-center mt-8">
          {acknowledged ? (
            <div
              onClick={() => {
                onAcknowledge(false);
              }}
            >
              <SuccessButton>
                <div className="flex items-center">
                  <FaCheck />
                  <div className="ml-2">{buttonTexts[1]}</div>
                </div>
              </SuccessButton>
            </div>
          ) : (
            <div
              onClick={() => {
                onAcknowledge(true);
              }}
            >
              <PrimaryButton>{buttonTexts[0]}</PrimaryButton>
            </div>
          )}
        </div>
      </AcknowledgementQuestionBody>
    </>
  );
};
