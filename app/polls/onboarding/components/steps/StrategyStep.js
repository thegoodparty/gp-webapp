import { MessageCard } from '../MessageCard'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { LuCircleDollarSign, LuListChecks, LuScrollText, LuUsersRound } from "react-icons/lu"
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function StrategyStep() {
  const { demoMessageText } = useOnboardingContext()

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.PollStrategyViewed)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        FREE introductory poll.
      </h1>
      <p className="text-left md:text-center w-full mt-4 text-muted-foreground text-lg font-normal">
        For your first poll, introduce yourself and ask your community what issues matter to them most. Later, you can customize your own polls and outreach. 
      </p>

      <div className="w-full items-center flex flex-col gap-8 mt-6">
        <MessageCard
          icon={<LuScrollText />}
          title="Message"
          description={<p className="mt-3 leading-normal medium text-sm">{demoMessageText}</p>}
          note="This message is open ended for the most authentic responses. It's been optimized for clarity and low bias. "
        />
        <MessageCard
          icon={<LuUsersRound />}
          title="Audience"
          description={<p className="mt-3 leading-normal medium text-sm">500 randomly selected residents</p>}
          note="Random selection is the most authentic way to reduce bias and ensure true representation."
        />
        <MessageCard
          icon={<LuListChecks />}
          title="Outreach Details"
          description={
            <ul>
              <li className="leading-normal medium text-sm">SMS Text Messages</li>
              <li className="leading-normal medium text-sm">Timeline: 3 Days</li>
            </ul>
          }
          note="Text messages are quick, direct, and yield high response rates. All of our messages are 10DLC compliant."
        />
        <MessageCard
          icon={<LuCircleDollarSign />}
          title="Investment"
          description={<p className="mt-3 leading-normal medium text-sm">Your first outreach is <b>FREE</b></p>}
          note="Future polls are approximately $0.03 per text."
        />
      </div>
    </div>
  )
}
