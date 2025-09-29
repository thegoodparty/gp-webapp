import { PiHandHeart } from 'react-icons/pi'

export default function NonCompliantPage({}) {

  return (
    <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Compliance is required to connect to your constituents.
      </h1>
      <p className="text-left mt-4 text-base text-muted-foreground">
        Let’s take a few moments now to get your account compliant and ensure you can engage your constituents without interruptions.
      </p>
      <div className="grid grid-cols-1 gap-4 mt-12 ">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 ">
          <div className="text-2xl bg-purple-100 rounded-full p-4">
            <PiHandHeart />
          </div>
          <p>
            GoodParty.org manages all the complicated paperwork so you can focus on your constituents.
          </p>
        </div>
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
          <div className="text-2xl bg-purple-100 rounded-full p-4">
            <PiHandHeart />
          </div>
          <p>
            Complies with 10DLC regulations for texting.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl bg-purple-100 rounded-full p-4">
            <PiHandHeart />
          </div>
          <p>
            Automatically manages your recipient list and opt-outs
          </p>
        </div>
      </div>
    </div>
  )
}
