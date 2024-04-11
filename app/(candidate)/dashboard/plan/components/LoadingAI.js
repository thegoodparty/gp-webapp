import Image from 'next/image';
import { LinearProgress } from '@mui/material';

export default function LoadingAI() {
  return (
    <div className="bg-white p-6 my-10 rounded-xl text-center text-xl">
      <div className="mb-3 text-4xl">Generating your campaign plan with</div>
      <div className="flex items-center justify-center">
        <div className="mr-3 text-2xl">AI Campaign Manager</div>
        <Image
          src="/images/campaign/ai-icon.svg"
          alt="GP-AI"
          width={48}
          height={48}
        />
      </div>
      <div className="max-w-lg mx-auto">
        <LinearProgress className="h-2 mt-4 mb-2 bg-black rounded [&>.MuiLinearProgress-bar]:bg-indigo-2000" />
      </div>
      <br />
      <br />
      This may take 1-2 minutes. <br />
      Please check out some of the resources we prepared for you while you wait.
    </div>
  );
}
