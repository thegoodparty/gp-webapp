'use client';
import Image from 'next/image';
import mateoImg from 'public/images/people/mateo.png';
import { useState } from 'react';
import Typewriter from 'typewriter-effect';

const msg1 =
  "Hey, I'm GP-ai, Good Party's AI campaign manager.  Let's build your custom campaign!";
const msg2 = 'Tell me what a good ABOUT statement might look like.';
const msg3 =
  "I'm Matthew, an independent candidate running for Mayor in Aliso Viejo. I believe in putting the needs of our community first and promoting common-sense solutions...";

export default function Chat() {
  const [typed1Completed, setTyped1Completed] = useState(false);
  const [typed2Completed, setTyped2Completed] = useState(false);
  return (
    <div className="mt-5">
      <div className="flex items-end justify-end mt-5">
        <div className="shadow-xl rounded-xl rounded-br-none mr-3 px-7 py-5 border-2 border-zinc-100 text-left flex-grow ml-28">
          <Typewriter
            options={{
              delay: 40,
              skipAddStyles: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(msg1)
                .pauseFor(1500)
                .callFunction((state) => {
                  setTyped1Completed(true);
                  state.elements.cursor.style.display = 'none';
                })
                .start();
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

      {typed1Completed ? (
        <div className="flex items-end  pt-5">
          <Image
            src={mateoImg}
            alt="Mateo"
            width={40}
            height={40}
            className="shadow-lg rounded-full w-10 h-10"
          />
          <div className="shadow-xl bg-slate-100 rounded-xl rounded-bl-none ml-3 px-7 py-5  text-left  flex-grow mr-28">
            <Typewriter
              options={{
                delay: 40,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(msg2)
                  .pauseFor(1500)
                  .callFunction((state) => {
                    setTyped2Completed(true);
                    state.elements.cursor.style.display = 'none';
                  })

                  .start();
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {typed2Completed ? (
        <div className="flex items-end justify-end mt-5">
          <div className="shadow-xl rounded-xl rounded-br-none mr-3 px-7 py-5 border-2 border-zinc-100 text-left flex-grow ml-28">
            <Typewriter
              options={{
                delay: 40,
              }}
              onInit={(typewriter) => {
                typewriter.typeString(msg3).start();
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
