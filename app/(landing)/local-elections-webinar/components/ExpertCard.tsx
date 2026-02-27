import Image from 'next/image'

interface ExpertCardProps {
  name: string
  role: string
  desc: string
  img: {
    src: string
    alt: string
  }
}

export const ExpertCard = ({
  name,
  role,
  desc,
  img: { src, alt },
}: ExpertCardProps): React.JSX.Element => (
  <div className="expert-card last:mb-0">
    <Image
      className="mb-4 mx-auto max-w-[60%]"
      src={src}
      alt={alt}
      height={248}
      width={248}
    />
    <h4 className="text-2xl font-semibold mb-1 md:text-4xl">{name}</h4>
    <h6 className="text-sm mb-6 md:text-xl">{role}</h6>
    <p className="text-sm leading-7 text-neutral-main">{desc}</p>
  </div>
)
