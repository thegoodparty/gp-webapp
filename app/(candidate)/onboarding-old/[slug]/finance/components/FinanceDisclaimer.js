import Image from 'next/image';
import { FaExclamation } from 'react-icons/fa';

export default function FinanceDisclaimer() {
  return (
    <div className="mb-10 lg:mb-20 px-5 lg:px-2 text-center mx-auto">
      <div className="flex max-w-2xl mx-auto justify-center items-center lg:items-start">
        <div className="text-4xl mr-4 lg:mr-8 text-red-700 lg:pt-1">
          <FaExclamation />
        </div>
        <div className="text-left">
          Please note that applying for an EIN is free, and you should only
          apply through the official IRS website. Be wary of third-party
          services that charge fees for obtaining an EIN on your behalf.
        </div>
      </div>
      <div className="flex max-w-2xl items-center  mx-auto bg-gp-yellow mt-14 py-6 px-8 rounded-xl">
        <div className="hidden lg:block text-4xl mr-8 text-red-700 pt-1">
          <Image
            src="/images/icons/party.svg"
            alt="party"
            width={60}
            height={62}
          />
        </div>
        <div className="text-left font-semibold">
          By completing this process, you&apos;ll be taking an essential step
          toward managing your campaign&apos;s finances and ensuring compliance
          with federal regulations.
        </div>
      </div>
    </div>
  );
}
