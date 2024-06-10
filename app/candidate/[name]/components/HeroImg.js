import Image from 'next/image';
import img from '/public/images/candidate/candidate-hero.jpg';

export default function HeroImg() {
  return (
    <div className="h-52 md:h-80 relative">
      <Image
        src={img}
        alt="Candidate"
        priority
        fill
        className=" object-cover object-center"
      />
    </div>
  );
}
