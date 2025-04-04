import Image from 'next/image'
import styles from './Homepage.module.scss'
import MaxWidth from '@shared/layouts/MaxWidth'

export default function FactsSection() {
  return (
    <section className="bg-primary-dark h-auto pt-20 pb-40">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6 pb-5">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/images/homepage/progress.svg"
                sizes="100vw"
                height={140}
                width={220}
                className="object-cover"
                alt=""
              />
            </div>
            <div className="text-center pb-5 w-full">
              <div className={`text-slate-50 p-3 ${styles.matrix2}`}>
                <span className="text-[80px] font-semibold">3</span>&nbsp;
                <span className="text-[50px] font-normal pr-2 pl-2">
                  out of
                </span>
                &nbsp;
                <span className="text-[80px] font-semibold">4</span>
              </div>
              <div className="text-[32px] font-semibold">
                <span className="text-gray-200">Americans want</span>&nbsp;
                <span className="text-secondary-light">more</span>&nbsp;
              </div>
              <div className="text-[32px] font-semibold">
                <span className="text-secondary-light">choices</span>&nbsp;
                <span className="text-gray-200">in politics</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/images/homepage/pie.svg"
                sizes="100vw"
                height={140}
                width={140}
                className="object-cover"
                alt="Pie"
              />
            </div>
            <div className="text-center w-full">
              <div
                className={`text-[80px] font-semibold text-slate-50 p-3 ${styles.matrix2}`}
              >
                52%
              </div>
              <div className="text-[32px] font-semibold">
                <span className="text-gray-200">of</span>&nbsp;
                <span className="text-[#847AFF]">Gen Z</span>&nbsp;
                <span className="text-gray-200">and Millennials</span>&nbsp;
              </div>
              <div className="text-[32px] font-semibold">
                <span className="text-gray-200">identify as an</span>&nbsp;
                <span className="text-[#847AFF]">independent</span>&nbsp;
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3 mt-20">
          <div className="col-span-12">
            <div className="flex flex-col items-center">
              <Image
                src="/images/homepage/heart.svg"
                sizes="100vw"
                height={178}
                width={270}
                className="object-cover"
                alt="GP"
              />
            </div>
            <div className="text-[32px] font-semibold text-center w-full">
              <div className="text-gray-200">
                GoodParty.org is a movement bringing together
              </div>
              <div className="text-gray-200">
                <span className="text-red-400">voters</span>&nbsp;and
                exciting&nbsp;
                <span className="text-red-400">
                  independent candidates&nbsp;
                </span>
                that&nbsp;<span className="text-red-400">can win</span>
              </div>
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
