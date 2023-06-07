'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Pill from '@shared/buttons/Pill';
import Image from 'next/image';

export default function Blog({ articles }) {
  return (
    <MaxWidth>
      <div className="flex items-center justify-center align-middle flex-col w-full mb-12">
        <h3 className=" font-black text-4xl mt-10 mb-12">Our Blog</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const { id, title, mainImage, summary, slug } = article;
            return (
              <div key={id} className="mb-12">
                <div className="flex lg:col-span-3 text-center items-center align-center justify-center">
                  {mainImage && (
                    <div className="flex relative w-[300px] h-[300px]">
                      <Image
                        src={`https:${mainImage.url}`}
                        alt={mainImage.alt}
                        sizes="100vw"
                        fill
                        className="object-cover object-top rounded-2xl"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col text-center items-center p-5">
                  <div className="text-lg font-medium mb-2">{title}</div>
                  <div className="text-md font-normal">
                    {summary.slice(0, 100)} ...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MaxWidth>
  );
}
