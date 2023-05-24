import Link from 'next/link';
import { AiOutlinePrinter } from 'react-icons/ai';
import { SlGraduation } from 'react-icons/sl';

export default function Hero() {
  return (
    <div className="mt-4 mb-8">
      <h1 className="font-bold text-6xl">Launch</h1>
      <div className="mt-4 mb-6">
        You&apos;re almost there! Remember that every step on your checklist
        brings you closer to being the voice of change and hope for your
        community.
      </div>
      <div className="flex">
        <Link href="/academy">
          <div className="bg-black bg-opacity-10 py-2 px-4 mr-3 flex items-center text-sm rounded-md">
            <div className="mr-3">GOODPARTY Academy</div>
            <SlGraduation />
          </div>
        </Link>
        {/* <div className="bg-black bg-opacity-10 py-2 px-4 mr-3 flex items-center text-sm rounded-md">
          <div className="mr-3">Print Checklist</div>
          <AiOutlinePrinter />
        </div> */}
      </div>
    </div>
  );
}
