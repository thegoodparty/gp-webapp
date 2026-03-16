import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Image from 'next/image'
import { ReactNode } from 'react'

interface TitleSectionProps {
  title: string
  subtitle?: ReactNode
  image?: string
  imgWidth?: number
  imgHeight?: number
}

export default function TitleSection({
  title,
  subtitle,
  image,
  imgWidth,
  imgHeight,
}: TitleSectionProps): React.JSX.Element {
  return (
    <div className="flex justify-between mb-3">
      <div>
        <H1>{title}</H1>
        <Body1 className="mt-3">{subtitle}</Body1>
      </div>
      <div>
        {image && (
          <Image src={image} width={imgWidth} height={imgHeight} alt={title} />
        )}
      </div>
    </div>
  )
}
