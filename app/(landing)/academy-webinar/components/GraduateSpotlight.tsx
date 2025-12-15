import MarketingH2 from '@shared/typography/MarketingH2'
import VictoriaImg from 'public/images/landing-pages/victoria.png'
import BreannaImg from 'public/images/landing-pages/breanna.png'
import CarlosImg from 'public/images/landing-pages/carlos.png'
import Image, { StaticImageData } from 'next/image'
import MaxWidth from '@shared/layouts/MaxWidth'
import Link from 'next/link'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { AcademyModalSignUpButton } from '../../academy/components/AcademySignUpModal/AcademyModalSignUpButton'

interface Graduate {
  name: string
  desc: string
  img: StaticImageData
  link: string
}

const graduates: Graduate[] = [
  {
    name: 'Carlos Rousselin',
    desc: 'Carlos Rousselin, a pharmaceutical scientist from Nashville, Tennessee, began wondering whether he should run for local office after learning about GoodParty.org Academy.',
    img: CarlosImg,
    link: '/blog/article/gpa-grad-carlos-rousselin',
  },
  {
    name: 'Breanna Stott',
    desc: 'After discovering GPA on Instagram, Stott connected with the vision of GoodParty.org — working to make people matter more than money in our democracy.',
    img: BreannaImg,
    link: '/blog/article/gpa-grad-breanna-stott',
  },
  {
    name: 'Victoria Masika',
    desc: 'Since announcing her run in early July, Masika has become one of the first candidates in North Carolina to affiliate with the Forward Party.',
    img: VictoriaImg,
    link: '/blog/article/race-update-victoria-masika',
  },
]

interface GraduateSpotlightProps {
  title?: React.ReactNode
  cta?: React.ReactNode
}

export default function GraduateSpotlight({ title, cta }: GraduateSpotlightProps): React.JSX.Element {
  const header = title ? (
    title
  ) : (
    <MarketingH2 className="text-center mb-16">Graduate spotlight</MarketingH2>
  )
  const ctaButton = cta ? (
    cta
  ) : (
    <AcademyModalSignUpButton>
      <PrimaryButton id="spotlight-cta">Sign up for free</PrimaryButton>
    </AcademyModalSignUpButton>
  )
  return (
    <section className="my-20">
      <MaxWidth>
        {header}
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          {graduates.map((graduate) => (
            <div
              key={graduate.name}
              className="col-span-12 md:col-span-4 h-full flex flex-col justify-between"
            >
              <div>
                <Image
                  src={graduate.img}
                  alt={graduate.name}
                  width={400}
                  height={400}
                  className="rounded-2xl w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="text-2xl font-medium mt-5 mb-2">
                  {graduate.name}
                </div>
                <div className="text-lg ">{graduate.desc}</div>
              </div>
              <Link
                href={graduate.link}
                className="mt-4 text-purple-400 font-bold"
              >
                Read more about {graduate.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">{ctaButton}</div>
      </MaxWidth>
    </section>
  )
}
