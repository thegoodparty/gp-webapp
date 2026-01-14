import MaxWidth from '@shared/layouts/MaxWidth'
import SearchLocation from './SearchLocation'
import Breadcrumbs, { BreadcrumbLink } from '@shared/utils/Breadcrumbs'
import { shortToLongState, StateAbbreviation } from 'helpers/statesHelper'
import Image from 'next/image'
import Subtitle2 from '@shared/typography/Subtitle2'
import { County, Municipality, Parent } from './types'

interface HeroProps {
  state: string
  county?: County
  color1: string
  color2: string
  level: 'state' | 'county' | 'city'
  municipality?: Municipality
  parent?: Parent
}

const Hero = ({
  state,
  county,
  color1,
  color2,
  level,
  municipality,
  parent,
}: HeroProps): React.JSX.Element => {
  const stateKey = state.toUpperCase()
  const isValidStateAbbreviation = (key: string): key is StateAbbreviation =>
    key in shortToLongState
  const stateName = isValidStateAbbreviation(stateKey)
    ? shortToLongState[stateKey]
    : stateKey
  const breadcrumbsLinks: BreadcrumbLink[] = [
    { href: `/elections`, label: 'How to run' },
    {
      href: '',
      label: `How to run in ${stateName}`,
    },
  ]
  if (level === 'county' && breadcrumbsLinks[1]) {
    breadcrumbsLinks[1].href = `/elections/${state}`
    breadcrumbsLinks.push({
      href: '',
      label: county?.name || '',
    })
  }

  if (level === 'city' && breadcrumbsLinks[1]) {
    breadcrumbsLinks[1].href = `/elections/${state}`
    breadcrumbsLinks.push({
      label: parent?.name || '',
      href: `/elections/${parent?.slug || ''}`,
    })
    breadcrumbsLinks.push({
      href: '',
      label: municipality?.name || '',
    })
  }
  let title = ''
  let subTitle = ''
  if (level === 'state') {
    title = `Run for ${stateName} state office`
    subTitle = `${stateName} state elections`
  } else if (level === 'county') {
    title = `Run for ${
      county?.name || 'a county'
    }, ${state.toUpperCase()} office`
    subTitle = `${county?.name || 'county'} elections`
  } else if (level === 'city') {
    const cityName = `${municipality?.name}`
    title = `Run for ${cityName || 'an'} office`
    subTitle = `${cityName || ''} elections`
  }
  return (
    <>
      <div
        className="mb-8 md:mb-2"
        style={{
          backgroundImage: `linear-gradient(131deg, ${color1} 2.74%, ${color2} 55.07%)`,
        }}
      >
        <div className="bg-white bg-opacity-60 py-5">
          <MaxWidth>
            <SearchLocation />
          </MaxWidth>
        </div>
        <div className="mt-8 md:mt-20">
          <MaxWidth>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-9">
                <Breadcrumbs links={breadcrumbsLinks} />
                <h1 className="text-3xl md:text-6xl font-medium">{title}</h1>
              </div>
              <div className="col-span-12 md:col-span-3 flex justify-end md:block">
                <div className="w-1/4  md:w-full">
                  <Image
                    src={`/images/elections/states/${state}.png`}
                    width={300}
                    height={300}
                    alt={stateName}
                  />
                </div>
              </div>
            </div>
          </MaxWidth>
          <div className="-mt-20  lg:-mt-40 bg-[linear-gradient(172deg,_rgba(0,0,0,0)_54.5%,_#F9FAFB_55%)] h-[calc(100vw*.17)] w-full" />
        </div>
      </div>
      <div className="pb-5">
        <MaxWidth>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src={`/images/elections/${level}-select.svg`}
                alt="state"
                width={28}
                height={28}
              />
              <h2 className="ml-2 font-semibold text-lg md:text-2xl">
                {subTitle}
              </h2>
            </div>
            <div className="items-center hidden md:flex">
              <Subtitle2 className="mr-3">Free tools to run and win</Subtitle2>
              <Image
                src="/images/black-logo.svg"
                width={208}
                height={40}
                alt="GoodParty.org"
              />
            </div>
          </div>
          <div className="border-b border-slate-200 mt-5"></div>
        </MaxWidth>
      </div>
    </>
  )
}

export default Hero
