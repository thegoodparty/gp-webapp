const PeopleShouldSection = () => (
  <section
    className="relative
  px-4
  pt-8
  md:pt-24
  md:px-24
  xl:px-0
  xl:pt-24
  xl:mx-auto"
  >
    <div className="max-w-screen-xl mx-auto">
      <div
        className="text-black
        font-medium"
      >
        <div className="mb-8 md:mb-16">
          <h3 className="text-4xl mb-4 md:text-6xl leading-snug">
            Money shouldn’t control <br className="hidden md:inline" />
            politics. <br className="md:hidden" />
            <span className="text-tertiary-main">People Should.</span>
          </h3>
          <p className="text-2xl text-gray-600 leading-snug font-sfpro font-normal mb-12  md:max-w-[85%]">
            The American two-party system has been overrun by big money. Over
            $20 billion will be spent on campaign contributions in 2024. 70% of
            these funds will come from special interests, corporations, and dark
            money.
          </p>
          <h4 className="font-medium text-xl">
            The results of this are inevitable:
          </h4>
          <section className="md:grid grid-cols-10 mb-12 md:mb-24">
            <div className="col-span-2">
              <h1 className="text-tertiary-main text-6xl leading-snug">12%</h1>
              <hr className="border-2 border-tertiary-main w-12 my-1.5" />
              <p className="font-sfpro leading-normal">
                of Americans approve of Congress
              </p>
            </div>
            <div className="col-span-3 col-start-4">
              <h1 className="text-tertiary-main text-6xl leading-snug">355M</h1>
              <hr className="border-2 border-tertiary-main w-12 my-1.5" />
              <p className="font-sfpro leading-normal">
                voters either vote for the lesser of two evils or don’t vote at
                all
              </p>
            </div>
          </section>
          <section className="mb-12">
            <h3 className="uppercase font-medium text-xs leading-4 mb-2 tracking-wider font-sfpro">
              Our solution:
            </h3>
            <p className="font-medium text-xl md:text-2xl leading-7 xl:max-w-[85%]">
              Empower real people to run effective campaigns without dark money,
              and outside the two-party system. By making it possible to run a
              viable campaign without these corrupting influences, Americans
              will see truly representative democracy.
            </p>
          </section>
        </div>
      </div>
    </div>
  </section>
)

export default PeopleShouldSection
