import Subtitle2 from '@shared/typography/Subtitle2'
import Race from './Race'

export default function RacesSection({ races }) {
  if (!races || races.length === 0) {
    return <section>No elections to show for this location</section>
  }
  return (
    <section>
      <div className="grid-cols-12 gap-3 hidden md:grid mb-2 px-5">
        <div className="col-span-12 md:col-span-9">
          <Subtitle2 className="">Position</Subtitle2>
        </div>
        <div className="col-span-12 md:col-span-2 text-center">
          <Subtitle2>Election date</Subtitle2>
        </div>
        {/* <div className="col-span-6 md:col-span-2">Candidates filed</div> */}
        <div className="col-span-12 md:col-span-1">&nbsp;</div>
      </div>
      {races.map((race) => (
        <div
          key={race.id}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <Race race={race} />
        </div>
      ))}
    </section>
  )
}
