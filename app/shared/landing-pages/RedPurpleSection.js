import Image from 'next/image'
import bgImg from 'public/images/landing-pages/red-bg.png'
import bgImgSm from 'public/images/landing-pages/red-bg-small.png'

export default function RedPurpleSection({ children, withPadding }) {
  return (
    <section
      className={`bg-purple-800 text-white pt-16 px-6 lg:py-16 flex flex-col items-center justify-center mt-8 rounded-xl relative overflow-hidden ${
        withPadding ? ' pb-80' : 'pb-16'
      }`}
    >
      <Image
        src={bgImg}
        sizes="100vw"
        fill
        className="hidden lg:block object-contain object-left-bottom"
        alt=""
      />
      <Image
        src={bgImgSm}
        sizes="100vw"
        fill
        className="lg:hidden object-contain object-left-bottom"
        alt=""
      />
      {children}
    </section>
  )
}
