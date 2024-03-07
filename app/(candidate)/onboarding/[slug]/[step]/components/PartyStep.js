'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import independentLogo from '/public/images/parties-logos/independent.png';
import libertarianLogo from '/public/images/parties-logos/libertarian-logo.png';
import fwdLogo from '/public/images/parties-logos/fwd-logo.png';
import greedLogo from '/public/images/parties-logos/green-logo.png';
import reformLogo from '/public/images/parties-logos/reform-logo.png';
import demLogo from '/public/images/parties-logos/democratic-logo.png';
import repLogo from '/public/images/parties-logos/republican-logo.png';
import Image from 'next/image';
import TextField from '@shared/inputs/TextField';
import Modal from '@shared/utils/Modal';

const parties = [
  {
    name: 'Independent',
    label: 'Independent / Non-Partisan',
    logo: independentLogo,
    wide: true,
  },
  { name: 'Libertarian Party', logo: libertarianLogo },
  { name: 'Forward Party', logo: fwdLogo },
  { name: 'Green Party', logo: greedLogo },
  { name: 'Reform Party', logo: reformLogo },
  { name: 'Democratic Party', logo: demLogo },
  { name: 'Republican Party', logo: repLogo },
];

const invalidOptions = [
  'democrat',
  'democratic party',
  'dnc',
  'dem',
  'blue dog democrat',
  'progressive democrat',
  'liberal democrat',
  'democratic national committee',
  'dccc',
  'democratic congressional campaign committee',
  'blue state democrat',
  'dem',
  'democratic',
  'blue democrat',
  'dem caucus',
  'democratic caucus',
  'democratic primary',
  'dem primary',
  'democratic convention',
  'dem convention',
  'blue wave',
  'dem pac',
  'democratic pac',
  'dem super pac',
  'democratic super pac',
  'dem candidate',
  'democratic candidate',
  'state democrat',
  'local democrat',
  'county democrat',
  'district democrat',
  'dem committee',
  'democratic committee',
  'dem delegate',
  'democratic delegate',
  'dem platform',
  'democratic platform',
  'dem endorsement',
  'democratic endorsement',
  'dem policies',
  'democratic policies',
  'dem values',
  'democratic values',
  'dem voter',
  'democratic voter',
  'dem supporter',
  'democratic supporter',
  'dem activist',
  'democratic activist',
  'republican',
  'gop',
  'rnc',
  'rep',
  'grand old party',
  'republican party',
  'conservative republican',
  'right-wing republican',
  'republican national committee',
  'nrcc',
  'republican congressional campaign committee',
  'red state republican',
  'repub',
  'republican',
  'red republican',
  'rep caucus',
  'republican caucus',
  'republican primary',
  'rep primary',
  'republican convention',
  'rep convention',
  'red wave',
  'rep pac',
  'republican pac',
  'rep super pac',
  'republican super pac',
  'rep candidate',
  'republican candidate',
  'state republican',
  'local republican',
  'county republican',
  'district republican',
  'rep committee',
  'republican committee',
  'rep delegate',
  'republican delegate',
  'rep platform',
  'republican platform',
  'rep endorsement',
  'republican endorsement',
  'rep policies',
  'republican policies',
  'rep values',
  'republican values',
  'rep voter',
  'republican voter',
  'rep supporter',
  'republican supporter',
  'rep activist',
  'republican activist',
];

export default function PartyStep(props) {
  const { campaign, step } = props;
  const router = useRouter();
  const [state, setState] = useState({
    party: campaign?.details?.party || '',
    otherParty: campaign?.details?.otherParty || '',
  });

  const [showInvalidModal, setShowInvalidModal] = useState(false);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    if (state.party !== '' && state.otherParty !== '') {
      return false;
    }
    return state.party !== '' || state.otherParty !== '';
  };

  const handleSave = async () => {
    // const isInvalid = invalidOtherParty();
    // console.log('isInvalid', isInvalid, state.otherParty);
    // return;
    if (invalidOtherParty()) {
      setShowInvalidModal(true);
      onChangeField('otherParty', '');
      return;
    }
    if (canSubmit) {
      const updated = {
        ...campaign,
        currentStep: onboardingStep(campaign, step),
        details: {
          ...campaign.details,
          ...state,
        },
      };
      await updateCampaign(updated);
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    }
  };

  const handleSelectParty = (partyName) => {
    if (state.party === partyName) {
      onChangeField('party', '');
    } else {
      onChangeField('party', partyName);
    }
  };

  const invalidOtherParty = () => {
    return (
      state.party === 'Republican Party' ||
      state.party === 'Democratic Party' ||
      (state.otherParty !== '' &&
        invalidOptions.includes(state.otherParty.toLowerCase()))
    );
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>
          What&apos;s your campaign&apos;s political affiliation? Also, did you
          know you can for office in other districts? Learn more…
        </H1>
        <Body1 className="mt-8 mb-10">
          We only support candidates outside of the Two Party system.
        </Body1>
        <div className="w-full max-w-md">
          <div className="grid grid-cols-12 gap-4">
            {parties.map((party) => (
              <div
                key={party.name}
                className={`col-span-12 ${party.wide ? '' : 'lg:col-span-6'}`}
              >
                <div
                  className={`border-2  rounded-lg p-6 flex flex-col items-center h-full group cursor-pointer hover:border-black transition-colors ${
                    party.name === state.party
                      ? 'border-black'
                      : 'border-slate-200'
                  }`}
                  onClick={() => {
                    handleSelectParty(party.name);
                  }}
                >
                  <Image
                    alt={party.name}
                    src={party.logo}
                    className={`mb-4 h-12  transition-all group-hover:grayscale-0 ${
                      party.name === state.party ? 'grayscale-0' : 'grayscale'
                    }`}
                    height={48}
                  />
                  <div
                    className={` group-hover:text-primary transition-colors ${
                      party.name === state.party
                        ? 'text-primary'
                        : 'text-indigo-300'
                    }`}
                  >
                    {party.label || party.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <TextField
              label="Other Party"
              fullWidth
              value={state.otherParty}
              onChange={(e) => onChangeField('otherParty', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
        <div className="mt-10" onClick={handleSave}>
          <PrimaryButton disabled={!canSubmit()} type="submit">
            Next
          </PrimaryButton>
        </div>
      </div>
      {showInvalidModal && (
        <Modal open closeCallback={() => setShowInvalidModal(false)}>
          <div className="my-5 text-2xl text-center">
            We only support candidates
            <br />
            outside of the Two Party system.
          </div>
          <div
            className="text-center mt-10"
            onClick={() => setShowInvalidModal(false)}
          >
            <PrimaryButton>
              <div className="px-6 ">Got it</div>
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </form>
  );
}
