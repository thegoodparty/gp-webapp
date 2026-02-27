import Hero from './Hero'
import KeyFeatures from './KeyFeatures'
import Pricing from './Pricing'
import ProTools from './ProTools'
import StartedBottom from './StartedBottom'
import Testimonials from './Testimonials'
import WhyUse from './WhyUse'
import Image from 'next/image'
import gradientImg from 'public/images/run-for-office/gradients.png'

interface Testimonial {
  name: string
  office: string
  image: {
    url: string
    alt: string
  }
  testimonial: string
}

interface RunForOfficePageProps {
  testimonials: Testimonial[]
}

export default function RunForOfficePage({
  testimonials,
}: RunForOfficePageProps): React.JSX.Element {
  return (
    <div className="bg-indigo-50">
      <Hero />
      <WhyUse />
      <div className="relative z-10">
        <KeyFeatures />

        <div className="max-w-screen-xl my-16 mx-4 md:mx-8 lg:mx-24 2xl:mx-auto py-16 px-6 md:px-12 lg:px-24 rounded-3xl bg-primary-dark">
          <ProTools />
          <Pricing />
        </div>

        <div className="absolute inset-0 z-[-1]">
          <Image
            src={gradientImg}
            fill
            alt="bg"
            className="object-cover object-center"
          />
        </div>
      </div>
      <Testimonials testimonials={testimonials} />
      <StartedBottom />
    </div>
  )
}
