import { BsChatDots } from 'react-icons/bs'
import Image from 'next/image'
import React, { ReactNode } from 'react'

interface LoadingAnimationProps {
  title?: string | ReactNode
  label?: string
}

export const LoadingAnimation = ({ title, label }: LoadingAnimationProps) => (
  <div className="py-12 px-6 text-center bg-zinc-100 rounded-xl flex flex-col items-center">
    <BsChatDots size={30} />
    <div className="text-4xl mt-2">
      {title ? (
        title
      ) : (
        <>
          <strong>Loading...</strong> Something
          <br />
          awesome.
        </>
      )}
      <div className="relative h-2 mt-4 mb-2 w-full overflow-hidden rounded-full bg-primary/20">
        <div className="absolute h-full w-1/2 rounded-full bg-primary animate-[indeterminate_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
    {label && (
      <h3 className="text-xl font-bold my-6">
        {label}
        <br />
        &nbsp;
      </h3>
    )}
    <div className="mt-20 mb-2 text-sm text-zinc-600">POWERED BY</div>
    <div>
      <Image
        src="/images/black-logo.svg"
        alt="GoodParty.org"
        data-cy="logo"
        width={174}
        height={20}
        className="self-center justify-self-center"
      />
    </div>
  </div>
)
