'use client'

import { useEffect, useState } from 'react'
import { times } from 'es-toolkit/compat'
import Image from 'next/image'
import MarketingH3 from '@shared/typography/MarketingH3'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import Subtitle2 from '@shared/typography/Subtitle2'
import Button from '@shared/buttons/Button'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

const LG_PAGE_SIZE = 3
const MD_PAGE_SIZE = 2
const SM_PAGE_SIZE = 1
const LG_MIN = 1024
const MD_MIN = 768

interface PageDotProps {
  pageNum: number
  isSelected: boolean
  onClick: () => void
}

function PageDot({
  pageNum,
  isSelected,
  onClick,
}: PageDotProps): React.JSX.Element {
  return (
    <span
      onClick={onClick}
      role="button"
      title={'Page ' + ++pageNum}
      className={`inline-block rounded-full h-2 w-2 mx-1 ${
        isSelected ? 'bg-primary-main' : 'bg-black/[0.38]'
      }`}
    ></span>
  )
}

interface TestimonialImage {
  url: string
  alt: string
}

interface Testimonial {
  name: string
  office: string
  image: TestimonialImage
  testimonial: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({
  testimonials,
}: TestimonialsProps): React.JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(SM_PAGE_SIZE)

  useEffect(() => {
    function handleResize(): void {
      const windowWidth = window.innerWidth
      const newPageSize =
        windowWidth > LG_MIN
          ? LG_PAGE_SIZE
          : windowWidth <= MD_MIN
          ? SM_PAGE_SIZE
          : MD_PAGE_SIZE

      if (pageSize !== newPageSize) {
        setPageSize(newPageSize)
        setCurrentPage(0)
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [pageSize])

  if (!testimonials || testimonials.length <= 0) return null

  const hasPages = testimonials.length > pageSize
  const lastPage = Math.floor((testimonials.length - 1) / pageSize)
  const startIndex = currentPage * pageSize

  function incrementPage(): void {
    const nextPage = currentPage < lastPage ? currentPage + 1 : lastPage

    setCurrentPage(nextPage)
  }

  function decrementPage(): void {
    const nextPage = currentPage > 0 ? currentPage - 1 : 0

    setCurrentPage(nextPage)
  }

  function goToPage(pageNum: number): void {
    if (pageNum >= 0 && pageNum <= lastPage) setCurrentPage(pageNum)
  }

  return (
    <section className="box-content max-w-screen-xl mx-auto py-16 px-8">
      <MarketingH3 className="block text-center">
        Candidates
        <Image
          className="inline align-middle mx-4"
          src="/images/logo/heart.svg"
          alt="heart"
          width={70}
          height={70}
        />
        us
      </MarketingH3>
      <Body1 className="mt-4 text-center">
        Our tools are trusted by over 2,500 candidates actively running for
        office nationwide.
      </Body1>
      <div className="px-6 py-8 grid grid-cols-12 gap-6">
        {testimonials
          .slice(startIndex, startIndex + pageSize)
          .map(({ name, office, image, testimonial }) => (
            <div
              key={name + office}
              className={`col-span-${
                12 / pageSize
              } p-12 bg-white border rounded-md`}
            >
              <div className="flex gap-2 items-center">
                <Image
                  className="rounded-md self-start"
                  src={'https:' + image.url}
                  alt={image.alt}
                  width={70}
                  height={70}
                />
                <div>
                  <H3>{name}</H3>
                  <Subtitle2 className="text-tertiary">{office}</Subtitle2>
                </div>
              </div>
              <Body1 className="mt-6">{testimonial}</Body1>
            </div>
          ))}
        {hasPages && (
          <div className="col-span-12 flex gap-x-12 items-center justify-center">
            <Button
              disabled={currentPage === 0}
              onClick={decrementPage}
              variant="text"
              size="large"
              className="flex items-center gap-2"
            >
              <MdArrowBack className="text-2xl" />
              Back
            </Button>
            <div>
              {times(lastPage + 1).map((pageNum) => (
                <PageDot
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  pageNum={pageNum}
                  isSelected={pageNum === currentPage}
                />
              ))}
            </div>
            <Button
              disabled={currentPage === lastPage}
              onClick={incrementPage}
              variant="text"
              size="large"
              className="flex items-center gap-2"
            >
              Next
              <MdArrowForward className="text-2xl" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
