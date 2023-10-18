import MarketingH2 from '@shared/typography/MarketingH2';
import VictoriaImg from 'public/images/landing-pages/victoria.png';
import BreannaImg from 'public/images/landing-pages/breanna.png';
import CarlosImg from 'public/images/landing-pages/carlos.png';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';

const graduates = [
  {
    name: 'Carlos Rousselin',
    desc: 'Carlos Rousselin, a pharmaceutical scientist from Nashville, Tennessee, began wondering whether he should run for local office after learning about Good Party Academy.',
    img: CarlosImg,
  },
  {
    name: 'Breanna Stott',
    desc: 'After discovering GPA on Instagram, Stott connected with the vision of Good Party — working to make people matter more than money in our democracy.',
    img: BreannaImg,
  },
  {
    name: 'Victoria Masika',
    desc: 'Since announcing her run in early July, Masika has become one of the first candidates in North Carolina to affiliate with the Forward Party.',
    img: VictoriaImg,
  },
];

export default function GraduateSpotlight() {
  return (
    <section className="my-20">
      <MaxWidth>
        <MarketingH2 className="text-center mb-16">Our curriculum</MarketingH2>
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          {graduates.map((graduate) => (
            <div key={graduate.name} className="col-span-12 md:col-span-4">
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
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
