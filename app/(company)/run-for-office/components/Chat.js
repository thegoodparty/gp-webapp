'use client';
import Image from 'next/image';
import mateoImg from 'public/images/people/mateo.png';
import { useState } from 'react';
import Typewriter from 'typewriter-effect';

const msg1 = 'Tell me what a good ABOUT statement might look like.';
const msg2 =
  "I'm Matthew, an independent candidate running for Mayor in Aliso Viejo. I believe in putting the needs of our community first and promoting common-sense solutions...";

export default function Chat() {
  const [typedCompleted, setTypedCompleted] = useState(false);
  return (
    <div className="mt-5">
      <div className="flex items-end">
        <Image
          src={mateoImg}
          alt="Mateo"
          width={40}
          height={40}
          className="shadow-lg rounded-full w-10 h-10"
        />
        <div className="shadow-xl bg-slate-100 rounded-xl rounded-bl-none ml-3 px-7 py-5">
          <Typewriter
            options={{
              delay: 40,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(msg1)
                .callFunction(() => {
                  setTypedCompleted(true);
                })

                .start();
            }}
          />
        </div>
        <div className="w-20">&nbsp;</div>
      </div>
      {typedCompleted ? (
        <div className="flex items-end justify-end mt-5">
          <div className=" w-44">&nbsp;</div>
          <div className="shadow-xl rounded-xl rounded-br-none mr-3 px-7 py-5 border-2 border-zinc-100 text-left flex-grow">
            <Typewriter
              options={{
                delay: 40,
              }}
              onInit={(typewriter) => {
                typewriter.typeString(msg2).start();
              }}
            />
          </div>
          <Image
            src="/images/campaign/ai-icon.svg"
            alt="GP-AI"
            width={40}
            height={40}
            className="shadow-lg rounded-full w-10 h-10"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
