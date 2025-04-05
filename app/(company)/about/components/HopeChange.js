import Image from 'next/image'
import Button from '@shared/buttons/Button'

const HopeChangeCard = ({ children }) => (
  <section
    className="bg-primary-dark
    p-5
    mb-4
    last:mb-0
    md:p-10
    md:mb-0
    rounded-3xl
    text-white
    md:min-h-[612.25px]
  "
  >
    <div className="relative h-full">{children}</div>
  </section>
)

export const HopeChange = ({
  image = {
    alt: '',
    src: '',
    height: 0,
    width: 0,
  },
  header,
  blurb,
  href,
  buttonText,
}) => (
  <HopeChangeCard>
    <Image
      className="mx-auto mb-4"
      width={252.004}
      height={217.389}
      {...image}
    />
    <h3 className="text-2xl font-medium mb-4 md:text-4xl">{header}</h3>
    <p className="font-sfpro text-sm leading-6 mb-4 md:text-base">{blurb}</p>
    <Button
      className="md:absolute md:bottom-0"
      href={href}
      size="large"
      color="neutral"
    >
      {buttonText}
    </Button>
  </HopeChangeCard>
)
