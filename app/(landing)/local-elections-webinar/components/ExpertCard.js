import Image from 'next/image';

export const ExpertCard = ({ name, role, desc, img: { src, alt } }) => (
  <div className="expert-card mb-16 last:mb-0">
    <Image
      className="mb-4 mx-auto max-w-[60%]"
      src={src}
      alt={alt}
      height={248}
      width={248}
    />
    <h4 className="text-2xl font-semibold mb-1">{name}</h4>
    <h6 className="text-sm mb-6">{role}</h6>
    <p className="text-sm leading-7 text-neutral-main">{desc}</p>
  </div>
);
