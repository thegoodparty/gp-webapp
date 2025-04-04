import Button from '@shared/buttons/Button'
import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import Image from 'next/image'

export default function MostAmericans() {
  return (
    <>
      <section className="bg-primary-dark py-16 text-white  text-center">
        <MaxWidth>
          <h4 className="text-3xl md:text-4xl font-medium">
            Most Americans are independent, making us the overlooked majority.
            We now have a symbol that signals to other independents that we are
            not alone!
          </h4>
          <h3 className="mt-8  text-4xl md:text-5xl font-medium ">
            Independents #BrightenAmerica
          </h3>
          <Image
            src="https://assets.goodparty.org/landing/brighten.png"
            width={252}
            height={68}
            alt="Brighten America"
            className="mx-auto mt-8"
          />
        </MaxWidth>
      </section>
      <section className="py-16 ">
        <MaxWidth>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 text-center">
              <Image
                src="https://assets.goodparty.org/landing/badge-of-independents.png"
                width={250}
                height={250}
                alt="Badge of Independents"
                className="mx-auto"
              />
              <h4 className="font-medium text-3xl md:text-4xl my-4">
                Badge of Independents
              </h4>
              <Body1>
                The Bright Heart represents the independent movement
              </Body1>
            </div>

            <div className="col-span-12 lg:col-span-4 text-center">
              <Image
                src="https://assets.goodparty.org/landing/stick-it-everywhere.png"
                width={250}
                height={250}
                alt="Stick it everywhere"
                className="mx-auto"
              />
              <h4 className="font-medium text-3xl md:text-4xl my-4">
                Stick it everywhere
              </h4>
              <Body1>
                Place stickers anywhere that could use a little brightening up
              </Body1>
            </div>

            <div className="col-span-12 lg:col-span-4 text-center">
              <Image
                src="https://assets.goodparty.org/landing/brighten-america.png"
                width={250}
                height={250}
                alt="BrightenAmerica"
                className="mx-auto"
              />
              <h4 className="font-medium text-3xl md:text-4xl my-4">
                #BrightenAmerica
              </h4>
              <Body1>
                Give these stickers to friends! Post using #BrightenAmerica
              </Body1>
            </div>
          </div>
          <div className="text-center md:w-56 mx-auto">
            <Button
              href="/get-stickers#get-stickers"
              size="large"
              className="mt-8 w-full"
            >
              Send Me Stickers!
            </Button>
          </div>
        </MaxWidth>
      </section>
    </>
  )
}
