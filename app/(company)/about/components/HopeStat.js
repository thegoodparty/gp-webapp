const HopeStatCard = ({ children }) => (
  <section className="bg-mint-900 p-5 mb-4 last:mb-0 rounded-3xl text-right md:mb-0 md:p-10">
    {children}
  </section>
)

export const HopeStat = ({ percentage, blurb }) => (
  <HopeStatCard>
    <h1 className="text-secondary-light text-6xl leading-snug md:text-8xl">
      {percentage}%
    </h1>
    <hr className="border-2 border-secondary-light w-12 my-1.5 ml-auto font-sfpro leading-normal" />
    <p className="text-white">{blurb}</p>
  </HopeStatCard>
)
