import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import { dateUsHelper } from 'helpers/dateHelper'
import Link from 'next/link'
import { FaArrowRightLong } from 'react-icons/fa6'

interface RaceData {
  normalizedPositionName?: string
  positionDescription?: string
  electionDate?: string
  positionLevel?: string
  slug: string
  hashId?: string | number
}

interface RaceProps {
  race: RaceData
}

type PositionLevelColors = {
  bg: string
  hover: string
}

const positionLevelColors: {
  STATE: PositionLevelColors
  COUNTY: PositionLevelColors
  CITY: PositionLevelColors
  LOCAL: PositionLevelColors
} = {
  STATE: {
    bg: 'bg-[#F5FFFC]',
    hover: 'hover:bg-[rgba(51,225,178,0.8)]',
  },
  COUNTY: {
    bg: 'bg-[#F5FFFC]',
    hover: 'hover:bg-[rgba(58,187,234,0.5)]',
  },
  CITY: {
    bg: 'bg-[#FDF9FF]',
    hover: 'hover:bg-[rgba(201,133,242,0.35)]',
  },
  LOCAL: {
    bg: 'bg-[#FDF9FF]',
    hover: 'hover:bg-[rgba(201,133,242,0.35)]',
  },
}

export default function Race({ race }: RaceProps): React.JSX.Element {
  const {
    normalizedPositionName,
    positionDescription,
    electionDate,
    positionLevel,
    slug,
  } = race

  const levelKey = positionLevel?.toUpperCase() as keyof typeof positionLevelColors
  const colors = positionLevelColors[levelKey] || {}

  return (
    <Link
      href={`/elections/position/${slug}`}
      className="no-underline"
      id={`office-${slug}-${race.hashId}`}
    >
      <div
        className={`py-5 px-5 mb-3 rounded-lg transition-colors ${
          colors.bg || ''
        } ${colors.hover || ''}`}
      >
        <div className="grid-cols-12 gap-3 grid items-center">
          <div className="col-span-12 md:col-span-9">
            <H3>{normalizedPositionName}</H3>
            <Body2 className="line-clamp-4 mt-1">{positionDescription}</Body2>
          </div>
          <div className="col-span-6 md:col-span-2 text-center">
            {dateUsHelper(electionDate)}
          </div>
          <div className="col-span-12 md:col-span-1 flex justify-end">
            <FaArrowRightLong className="mr-2" />
          </div>
        </div>
      </div>
    </Link>
  )
}
