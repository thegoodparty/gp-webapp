'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import MarketingH2 from '@shared/typography/MarketingH2'
import MarketingH5 from '@shared/typography/MarketingH5'
import Modal from '@shared/utils/Modal'
import Image from 'next/image'
import { memo, useState } from 'react'
import { BiSolidHappy } from 'react-icons/bi'
import { FaHeart } from 'react-icons/fa'
import { MdPeople } from 'react-icons/md'
import { RiMedal2Fill } from 'react-icons/ri'

interface Card {
  title: string
  description: string
  icon: React.JSX.Element
  modalTitle: string
  modalDescription: React.JSX.Element
}

const cards: Card[] = [
  {
    title: 'Independent',
    description:
      'Candidates are running outside the two-party system as an Independent, nonpartisan, or third-party candidate.',
    icon: <BiSolidHappy />,
    modalTitle: 'What does it mean to be an independent candidate?',
    modalDescription: (
      <>
        Candidates must appear on the ballot in a nonpartisan race or run in a
        partisan race as a nonpartisan, independent, or third-party candidate.
        <br />
        <br />
        Candidates do NOT pay membership dues or otherwise engage in fundraising
        for either of the two major political parties and will work with all
        sides to the benefit of their constituents.
      </>
    ),
  },
  {
    title: 'People-Powered',
    description:
      'Candidates take the majority of their funds from grassroots donors and reject the influence of special interests and big money.',
    icon: <MdPeople />,
    modalTitle: 'What does it mean to be a people-powered candidate?',
    modalDescription: (
      <>
        GoodParty.org Certified candidates run grassroots campaigns that depend
        on being connected to and promoted by the people that they&apos;ll be
        serving.
        <br />
        <br />
        They pledge that the majority of their financial support will come from
        individual donors, NOT from big-money and special interests of
        corporations, unions, or PACs.
      </>
    ),
  },
  {
    title: 'Anti-Corruption',
    description:
      'Candidates pledge to be accountable and transparent with their policy agendas and report attempts to unduly influence them.',
    icon: <RiMedal2Fill />,
    modalTitle: 'What does it mean to be an anti-corruption candidate?',
    modalDescription: (
      <>
        They pledge to be open, accountable, and transparent about their
        positions and progress on issues.
        <br />
        <br />
        They&apos;ll stay connected to, informed by, and responsive to their
        constituents using the best tools available.
        <br />
        <br />
        They pledge that, if elected, they will always work to champion or
        support anti-corruption policies that enable more competition, better
        choices in elections; and true transparency and accountability in
        government.
      </>
    ),
  },
  {
    title: 'Civility',
    description:
      "Candidate pledge to run a clean campaign free of mudslinging and uphold a minimum standard of civility in their campaign's conduct",
    icon: <FaHeart />,
    modalTitle: 'What does it mean to be a civil candidate?',
    modalDescription: (
      <>
        They agree to run a civil campaign focused on listening to citizens,
        learning about important issues and demonstrating their ability to serve
        not mudslinging with opponents.
        <br />
        <br />
        GoodParty.org Certified candidates agree to abide by a minimum standard
        of civility.
      </>
    ),
  },
]

export default memo(function InfoSection(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState<Card | false>(false)
  return (
    <div className="bg-indigo-100 py-8 lg:py-16">
      <MaxWidth>
        <MarketingH2 className="text-center">
          Who are
          <Image
            src="/images/heart.svg"
            width={80}
            height={80}
            alt="gp.org"
            className="mx-3 static inline-block w-12 h-12 lg:w-20 lg:h-20"
            priority
          />
          independent candidates?
        </MarketingH2>
        <MarketingH5 className="mt-8 text-center mb-6 lg:mb-12">
          Candidates are Independent, People-Powered, Anti-Corruption, and agree
          to a minimum standard of civility.
        </MarketingH5>
        <div className="grid grid-cols-12 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="col-span-12 md:col-span-6 lg:col-span-3 bg-white p-4 border border-slate-300 rounded-2xl flex flex-col justify-between"
            >
              <div className=" md:pb-12 lg:pb-28 ">
                <div className="text-5xl">{card.icon}</div>
                <H2 className="mt-2">{card.title}</H2>
                <Body1 className="mt-2 text-gray-600 mb-4 lg:mb-0">
                  {card.description}
                </Body1>
              </div>
              <PrimaryButton
                fullWidth
                onClick={() => {
                  setModalOpen(card)
                }}
              >
                Learn More
              </PrimaryButton>
            </div>
          ))}
        </div>
      </MaxWidth>
      <Modal open={!!modalOpen} closeCallback={() => setModalOpen(false)}>
        {modalOpen && (
          <div className="w-[80vw] max-w-2xl">
            <H2>{modalOpen.modalTitle}</H2>
            <Body2 className="mt-2">{modalOpen.modalDescription}</Body2>
            <PrimaryButton
              className="mt-8"
              onClick={() => setModalOpen(false)}
              fullWidth
            >
              Close
            </PrimaryButton>
          </div>
        )}
      </Modal>
    </div>
  )
})
