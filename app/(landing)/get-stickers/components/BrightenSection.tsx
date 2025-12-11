import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'

export default function BrightenSection(): React.JSX.Element {
  return (
    <section className="bg-indigo-100 pt-8 pb-16">
      <MaxWidth>
        <h3 className="text-3xl text-center font-medium mb-8">
          Independents #BrightenAmerica
        </h3>
        <div className="md:grid md:grid-cols-12 md: gap-4">
          <div className=" col-span-12 md:col-span-6 lg:col-span-3">
            <div className="flex justify-center md:justify-end lg:justify-center relative -ml-24 md:ml-0">
              <Image
                src="https://assets.goodparty.org/landing/stickers1.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
          </div>
          <div className=" col-span-12 md:col-span-6 lg:col-span-3 relative">
            <div className="flex justify-center md:justify-start lg:justify-center absolute -top-12 md:relative md:top-0  left-[calc(50%-144px+48px)]  md:left-0">
              <Image
                src="https://assets.goodparty.org/landing/stickers2.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
            <div className="flex justify-center md:hidden opacity-0">
              <Image
                src="https://assets.goodparty.org/landing/stickers2.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
          </div>
          <div className=" col-span-12 md:col-span-6 lg:col-span-3 relative">
            <div className="flex justify-center md:justify-end lg:justify-center absolute -top-24  left-[calc(50%-144px-48px)] md:top-0 md:left-0  md:relative">
              <Image
                src="https://assets.goodparty.org/landing/stickers3.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
            <div className="flex justify-center md:hidden opacity-0">
              <Image
                src="https://assets.goodparty.org/landing/stickers3.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="hidden md:flex justify-center md:justify-start lg:justify-end">
              <Image
                src="https://assets.goodparty.org/landing/stickers4.png"
                width={288}
                height={288}
                alt="Stickers"
              />
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
