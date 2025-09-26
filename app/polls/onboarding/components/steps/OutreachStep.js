import { LuHandHeart , LuSmile , LuHeartHandshake  } from 'react-icons/lu'

export default function OutreachStep({  }) {

  return (
    <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto mb-16">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Use polling to prioritize issues and remove bias.
      </h1>
      <p className="text-left mt-4 text-lg font-normal text-muted-foreground">
        Understanding your community’s priorities will help you:
      </p>
      <div className="grid grid-cols-1 gap-4 mt-6 ">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 ">
          <div className="text-2xl bg-red-200 rounded-full p-4">
            <LuHandHeart  />
          </div>
          <p>
            Shine a light on what your whole community wants, not just the loudest voices
          </p>
        </div>
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
          <div className="text-2xl bg-yellow-200 rounded-full p-4">
            <LuSmile />
          </div>
          <p>
            Have confidence you are focused on community priorities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl bg-purple-100 rounded-full p-4">
            <LuHeartHandshake  />
          </div>
          <p>
            Build trust through transparency by showing your progress
          </p>
        </div>
      </div>
    </div>
  )
}
