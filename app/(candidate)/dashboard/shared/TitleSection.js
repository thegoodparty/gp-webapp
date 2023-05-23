import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import Image from 'next/image';

export default function TitleSection({
  title,
  subtitle,
  image,
  imgWidth,
  imgHeight,
}) {
  return (
    <div className="flex justify-between mb-3">
      <div>
        <H1>{title}</H1>
        <Body1 className="mt-3">{subtitle}</Body1>
      </div>
      <div>
        <Image src={image} width={imgWidth} height={imgHeight} alt={title} />
      </div>
    </div>
  );
}
