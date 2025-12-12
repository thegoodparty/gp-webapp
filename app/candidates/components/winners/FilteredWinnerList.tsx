import Slider from 'react-slick'

import WinnerSnippet from './WinnerSnippet'
import H5 from '@shared/typography/H5'
import { numberFormatter } from 'helpers/numberHelper'
import { useEffect, useState } from 'react'

interface CustomArrowProps {
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
}

function CustomArrow(props: CustomArrowProps): React.JSX.Element {
  const { className, style, onClick } = props
  return (
    <div
      role="button"
      tabIndex={0}
      className={'before:!text-primary ' + className}
      style={{ ...style }}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
    />
  )
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <CustomArrow />,
  prevArrow: <CustomArrow />,
  appendDots: (dots: React.ReactNode) => (
    <div
      style={{
        overflow: 'hidden',
        maxWidth: '400px',
        left: 'calc(50% - 200px)',
        margin: '0 auto',
      }}
    >
      <ul
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {dots}
      </ul>
    </div>
  ),
  afterChange: () => {
    // handles limiting the number of pagination dots that are visible at once
    const currentDot = document.querySelector('.slick-dots .slick-active') as HTMLElement | null
    const dotWrapper = currentDot?.parentElement?.parentElement
    const padding = currentDot ? currentDot.offsetWidth * 1.5 : 0

    if (
      dotWrapper &&
      currentDot &&
      (currentDot.offsetLeft >
        dotWrapper.scrollLeft + dotWrapper.clientWidth - padding ||
        currentDot.offsetLeft < dotWrapper.scrollLeft + padding)
    ) {
      const scrollTarget = Math.max(
        0,
        currentDot.offsetLeft - dotWrapper.clientWidth / 2,
      )

      dotWrapper.scrollTo({
        left: scrollTarget,
        behavior: 'smooth',
      })
    }
  },
}

interface Campaign {
  slug: string
  firstName?: string
  lastName?: string
  office: string
  state: string
  avatar?: string
}

interface FilteredWinnerListProps {
  campaigns: Campaign[]
}

export default function FilteredWinnerList({ campaigns }: FilteredWinnerListProps): React.JSX.Element {
  // split campaigns to and array of arrays each has 9 campaigns max
  const [splitCampaigns, setSplitCampaigns] = useState<Campaign[][]>([])
  useEffect(() => {
    const split = campaigns.reduce((acc: Campaign[][], campaign, index) => {
      const i = Math.floor(index / 9)
      if (!acc[i]) {
        acc[i] = []
      }
      acc[i].push(campaign)
      return acc
    }, [])
    setSplitCampaigns(split)
  }, [campaigns])

  return (
    <div className="pb-4">
      <H5 className="mb-6">{numberFormatter(campaigns.length)} candidates</H5>
      <Slider {...settings}>
        {splitCampaigns.map((slideCampaigns, index) => (
          <div key={index} className="pb-12">
            <div className="grid grid-cols-12 gap-4">
              {slideCampaigns.map((campaign) => (
                <div key={campaign.slug} className="col-span-12 lg:col-span-4">
                  <WinnerSnippet campaign={campaign} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
