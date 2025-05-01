import Link from 'next/link'
import { ALPHABET } from '@shared/utils/alphabet'

export default function LayoutWithAlphabet({ activeLetter = 'A', children }) {
  return (
    <div className="flex lg:block mt-4 lg:mt-16">
      <div className="text-zinc-500">
        <div className="mb-1 lg:mb-0 lg:inline-block lg:mr-3">#</div>
        {ALPHABET.map((letter) => (
          <Link
            key={letter}
            href={`/political-terms/${letter.toLowerCase()}`}
            className="pb-1 block lg:inline-block lg:mr-3"
            style={
              activeLetter === letter
                ? { fontWeight: '900', color: 'black' }
                : {}
            }
          >
            {letter}
          </Link>
        ))}
      </div>
      <div className="pl-4 lg:pl-0 lg:mt-16">{children}</div>
    </div>
  )
}
