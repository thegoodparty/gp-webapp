import Link from 'next/link';

export const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export default function LayoutWithAlphabet({ activeLetter = 'A', children }) {
  return (
    <div className="flex lg:block mt-4 lg:mt-16">
      <div className="text-zinc-500">
        <div className="mb-1 lg:mb-0 lg:inline-block lg:mr-3">#</div>
        {alphabet.map((letter) => (
          <Link
            key={letter}
            href={`/political-terms/${letter}`}
            className="mb-1 lg:mb-0 block lg:inline-block lg:mr-3"
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
  );
}
