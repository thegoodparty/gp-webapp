'use client'
import 'intro.js/introjs.css'
import './ContentTutorial.css'
import { Steps } from 'intro.js-react'
import { useEffect, useRef, useState } from 'react'
import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import { setCookie } from 'helpers/cookieHelper'

const steps = [
  {
    intro: (
      <div className="text-center w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Content Creation, Simplified</H2>
          <Body1 className="mt-12">
            Preparing for debates or community events? Need engaging content?
            Our AI Campaign Tool is here to help. High-quality, custom content
            is just a few clicks away.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    element: '.new-content-btn',
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Campaign Content Creator</H2>
          <Body1 className="mt-12">
            Unleash the power of AI to elevate your campaign&apos;s voice. Our
            Campaign Content Creator offers intuitive tools to craft compelling
            social media posts, engaging press releases, effective fundraising
            emails, and informative campaign updates. Streamline your
            communications and connect with your audience more effectively, all
            with a few clicks.
          </Body1>
        </div>
      </div>
    ),
  },
  {
    intro: (
      <div className="w-[80vw] max-w-[500px]">
        <div className="px-5 ">
          <H2>Find a Template to fit your needs</H2>
          <Body1 className="mt-12">
            Effortlessly create a compelling Press Release with our Template
            Selector. Choose from a variety of professionally designed
            templates, each structured to convey your message with clarity and
            impact. Simplify your content creation and ensure your voice is
            heard.
          </Body1>
        </div>
      </div>
    ),
  },
]

export default function ContentTutorial({
  newContentCallback,
  onCompleteCallback,
}) {
  const stepsRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(true)
  }, [])

  const onExit = () => {
    setCookie('tutorial-content', true)
  }

  const onComplete = () => {
    if (onCompleteCallback) {
      onCompleteCallback('pressRelease')
    }
  }

  const handleChange = (nextStepIndex) => {
    if (nextStepIndex === 2) {
      newContentCallback()
    }
  }
  const onBeforeChange = (nextStepIndex) => {
    stepsRef.current?.updateStepElement(nextStepIndex)
    setTimeout(() => {
      // Use the intro.js instance to access buttons more safely
      const intro = stepsRef.current?.introJs
      if (intro && intro._targetElement) {
        const backButton = intro._targetElement.querySelector(
          '.introjs-prevbutton',
        )
        if (backButton) {
          backButton.style.display =
            nextStepIndex === 0 ? 'none' : 'inline-block'
        }
      }
    }, 1)
  }

  return (
    <div>
      <Steps
        enabled={enabled}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        onComplete={onComplete}
        onChange={handleChange}
        onBeforeChange={onBeforeChange}
        options={{
          showBullets: false,
          doneLabel: 'Continue to press release',
        }}
        ref={stepsRef}
      />
    </div>
  )
}
