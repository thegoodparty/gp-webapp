'use client'

import Overline from '@shared/typography/Overline'
import { ArrowUpwardRounded } from '@mui/icons-material'

export default function ScrollToTop() {
  function handleClick(e) {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <a
      className="group hidden lg:block absolute text-center bottom-[-32px] left-[100%] ml-[50px] z-10"
      rel="noopener noreferrer nofollow"
      href="#article-top"
      onClick={handleClick}
    >
      <span className="group-hover:bg-black group-hover:text-white inline-block p-4 w-16 h-16 text-center rounded-full border-2 border-solid border-black">
        <ArrowUpwardRounded />
      </span>
      <Overline className="whitespace-nowrap mt-4">Scroll To Top</Overline>
    </a>
  )
}
