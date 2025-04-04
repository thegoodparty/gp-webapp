'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import Modal from '@shared/utils/Modal'
import { getUserCookie, setCookie } from 'helpers/cookieHelper'
import { trackEvent } from 'helpers/fullStoryHelper'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from 'react-icons/md'

const options = [
  {
    id: 'claim',
    label: 'Access Voter Data & Tools',
    description: 'Get voter outreach tools and custom data for your campaign.',
  },
  {
    id: 'help',
    label: 'Help this campaign',
    description:
      'See how you can help independent campaigns like this succeed.',
  },
  {
    id: 'learnMore',
    label: 'Learn more about GoodParty.org',
    description: 'See why and how we help independents run, win and serve.',
  },
]

export default function CTA({ children, id }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const handleOpen = () => {
    setOpen(true)
    trackEvent('candidate CTA clicked', { id })
  }

  const handleClose = () => {
    setSelected(null)
    setOpen(false)
    trackEvent('candidate CTA cancelled', { id })
  }

  const handleNext = () => {
    trackEvent('candidate CTA selected', { id, selected })
    setOpen(false)

    switch (selected) {
      case 'claim':
        const path = pathname.replace('/candidate/', '')
        setCookie('claimProfile', path)
        const user = getUserCookie()
        if (user) {
          router.push('/dashboard')
        } else {
          router.push('/run-for-office')
        }
        break
      case 'help':
        router.push('/info-session')
        break
      case 'learnMore':
        router.push('/')
        break
      default:
        break
    }
  }
  return (
    <>
      <div onClick={handleOpen} id={id}>
        {children}
      </div>
      <Modal open={open} closeCallback={handleClose}>
        <div className="w-[90vw] max-w-xl p-2 md:p-4">
          <H2 className="text-center">What would you like to do?</H2>
          <Body2 className="mt-2 mb-8">
            By choosing from one of the following, we can send you to the right
            location.
          </Body2>

          {options.map((option) => (
            <div
              key={option.id}
              className={`flex border  py-4 px-6 rounded-lg mb-4 cursor-pointer ${
                selected === option.id
                  ? 'border-primary shadow-md'
                  : 'border-gray-400'
              }`}
              onClick={() => {
                setSelected(option.id)
              }}
            >
              <div className="pt-1">
                {selected === option.id ? (
                  <MdOutlineRadioButtonChecked size={24} />
                ) : (
                  <MdOutlineRadioButtonUnchecked size={24} />
                )}
              </div>
              <div className="ml-3">
                <H5>{option.label}</H5>
                <Body2 className=" text-gray-600">{option.description}</Body2>
              </div>
            </div>
          ))}
          <div className="mt-8 flex justify-between">
            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
            <PrimaryButton disabled={!selected} onClick={handleNext}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  )
}
