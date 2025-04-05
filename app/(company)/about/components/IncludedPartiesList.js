import Image from 'next/image'

const PartyLogo = ({ logoFileName, name }) => (
  <Image
    className="inline-block mr-4 max-h-[48px] object-contain"
    height={48}
    width={48}
    alt={name}
    src={logoFileName}
  />
)
const PARTIES = [
  { name: 'Forward Party', logoFileName: 'fwd-logo.png' },
  { name: 'Alliance Party', logoFileName: 'alliance-logo.png' },
  { name: 'Libertarian Party', logoFileName: 'libertarian-torch-logo.png' },
  { name: 'Green Party', logoFileName: 'green-logo.png' },
  { name: 'Reform Party', logoFileName: 'reform-logo.png' },
  { name: 'Working Families Party', logoFileName: 'wfp-logo.png' },
]
export const IncludedPartiesList = () => (
  <div
    className="bg-white
  p-6
  rounded-2xl"
  >
    <h2 className="text-xl leading-7">Included in our movement</h2>
    <hr className="border-2 border-tertiary-main w-12 mt-2 mb-8" />
    {PARTIES.map(({ name, logoFileName }) => (
      <div key={name} className="mb-4 flex items-center">
        <PartyLogo
          name={name}
          logoFileName={`/images/parties-logos/${logoFileName}`}
        />
        <span className="text-sm md:text-base font-sfpro font-medium">
          {name}
        </span>
      </div>
    ))}
  </div>
)
