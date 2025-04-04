import SecondaryButton from '@shared/buttons/SecondaryButton'
import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import { P2vModal } from './P2vModal'
import { buildTrackingAttrs } from 'helpers/fullStoryHelper'

export function P2vTitle(props) {
  const trackingAttrs = buildTrackingAttrs('Understanding P2V Button')

  return (
    <div className="lg:flex justify-between">
      <div className="">
        <H2>Path to Victory</H2>
        <Body2 className=" text-gray-600">
          Understand your campaign phase, tactics, and overall voter contact
          progress.
        </Body2>
      </div>
      <div className="mt-4 lg:mt-0">
        <P2vModal
          triggerElement={
            <SecondaryButton fullWidth variant="outlined" {...trackingAttrs}>
              Understanding Path to Victory
            </SecondaryButton>
          }
          pathToVictory={props.pathToVictory}
        />
      </div>
    </div>
  )
}
