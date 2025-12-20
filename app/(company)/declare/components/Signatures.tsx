'use client'
import { useState, useEffect } from 'react'
import SignModal from './SignModal'
import { NextFont } from 'next/dist/compiled/@next/font'

interface SignaturesProps {
  signatures: string
  tangerine: NextFont
}

export default function Signatures({ signatures, tangerine }: SignaturesProps): React.JSX.Element {
  let [signer, setSigner] = useState('')
  let modalProps = { tangerine, setSigner }

  useEffect(() => {
    try {
      if (localStorage.getItem('signature') != null) {
        const signature = localStorage.getItem('signature')
        if (signature && !signatures.includes(signature)) {
          setSigner(signature)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [signatures])

  return (
    <>
      <div className="flex font-bold text-xl max-w-[65%] md:max-w-[55%] mx-auto justify-between items-center align-middle mt-10">
        <div className="flex flex-row">
          <p>Join the party</p>
          <span role="img" className="ml-1" aria-label="Party">
            🎉
          </span>
        </div>
        <SignModal {...modalProps} />
      </div>
      <div
        className={`flex flex-col max-w-[55%] mt-8 mx-auto justify-center items-center text-2xl ${tangerine.className}`}
      >
        {signer}
        {signatures}
      </div>

      <div
        className={`flex flex-col max-w-[55%] mx-auto justify-center items-center text-2xl ${tangerine.className}`}
      >
        ... And more!
      </div>
    </>
  )
}
