import { AiOutlineHeart } from 'react-icons/ai'
import { LuGraduationCap, LuPartyPopper } from 'react-icons/lu'
import {
  RiBuildingLine,
  RiCloudWindyLine,
  RiCurrencyLine,
  RiEmotionLaughFill,
  RiGovernmentLine,
  RiHeartsLine,
  RiHomeHeartLine,
  RiLandscapeLine,
  RiMentalHealthLine,
  RiPlantLine,
  RiPoliceCarLine,
  RiShieldCheckLine,
  RiTornadoLine,
  RiTrainLine,
  RiUserSearchLine,
} from 'react-icons/ri'
import { TbDrone } from 'react-icons/tb'

interface IssuesIconProps {
  issueName?: string
}

export default function IssuesIcon({
  issueName = '',
}: IssuesIconProps): React.JSX.Element {
  const name = issueName.toLowerCase().trim()
  if (name === 'transportation') {
    return <RiTrainLine />
  }
  if (name === 'electoral reform') {
    return <RiGovernmentLine />
  }
  if (name === 'housing') {
    return <RiHomeHeartLine />
  }
  if (name === 'education') {
    return <LuGraduationCap />
  }
  if (name === 'environment') {
    return <RiCloudWindyLine />
  }
  if (name === 'public safety') {
    return <RiShieldCheckLine />
  }
  if (name === 'urban planning and smart growth') {
    return <RiBuildingLine />
  }
  if (name === 'economic development') {
    return <RiCurrencyLine />
  }
  if (name === 'government transparency') {
    return <RiUserSearchLine />
  }
  if (name === 'parks and rec') {
    return <RiLandscapeLine />
  }
  if (name === 'community health and wellness') {
    return <RiMentalHealthLine />
  }
  if (name === 'cultural diversity and inclusion') {
    return <RiHeartsLine />
  }
  if (name === 'aging and senior services') {
    return <RiPlantLine />
  }
  if (name === 'quality of life') {
    return <RiEmotionLaughFill />
  }
  if (name === 'emergency preparedness') {
    return <RiTornadoLine />
  }
  if (name === 'police accountability') {
    return <RiPoliceCarLine />
  }
  if (name === 'arts and culture') {
    return <LuPartyPopper />
  }
  if (name === 'technology and innovation') {
    return <TbDrone />
  }
  return <AiOutlineHeart />
}
