import { calculateVoterContactCounts } from 'app/(candidate)/dashboard/components/voterGoalsHelpers';
import { useState } from 'react';
import Paper from '@shared/utils/Paper';
import H2 from '@shared/typography/H2';
import {
  ANIMATED_PROGRESS_BAR_SIZES,
  AnimatedProgressBar,
} from 'app/(candidate)/dashboard/components/p2v/AnimatedProgressBar';
import Subtitle2 from '@shared/typography/Subtitle2';
import { numberFormatter } from 'helpers/numberHelper';
import { BsInfoCircle } from 'react-icons/bs';
import { VoterContactCountsModal } from 'app/(candidate)/dashboard/components/VoterContactCountsModal';

export const CampaignProgress = ({ pathToVictory, reportedVoterGoals }) => {
  const { needed, contacted } = calculateVoterContactCounts(
    pathToVictory,
    reportedVoterGoals,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <Paper className="mb-4">
      <H2 className="mb-4">Campaign progress</H2>
      <div className="mb-4">
        <AnimatedProgressBar
          percent={(contacted / needed) * 100}
          size={ANIMATED_PROGRESS_BAR_SIZES.MD}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <Subtitle2>{numberFormatter(contacted)} voters contacted</Subtitle2>
        <Subtitle2 className="flex items-center">
          {numberFormatter(needed)} voter contacts needed
          <BsInfoCircle className="ml-2 inline" onClick={toggleModalOpen} />
          <VoterContactCountsModal
            {...{ pathToVictory, open: modalOpen, setOpen: toggleModalOpen }}
          />
        </Subtitle2>
      </div>
    </Paper>
  );
};
