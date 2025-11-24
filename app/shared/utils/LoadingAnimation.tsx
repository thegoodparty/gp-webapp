import { BsChatDots } from 'react-icons/bs'
import LinearProgress from '@mui/material/LinearProgress'
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
      <LinearProgress className="h-2 mt-4 mb-2 bg-black rounded [&>.MuiLinearProgress-bar]:bg-slate-600" />
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

