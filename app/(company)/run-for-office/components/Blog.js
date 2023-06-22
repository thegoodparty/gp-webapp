'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import Link from 'next/link';

export default function Blog({ articles }) {
  return (
    <MaxWidth>
      <div className="flex items-center justify-center align-middle flex-col w-full mb-12">
        <h3 className=" font-black text-4xl mt-5 mb-5">Our Blog</h3>
      </div>

      <div className="grid grid-cols-12 gap-3 mb-20 justify-items-center">
        {articles.map((article) => {
          const { id, title, mainImage, summary, slug } = article;
          return (
            <div key={id} className="flex col-span-12 lg:col-span-4">
              <Link
                id={slug}
                href={`/blog/article/${slug}`}
                className="no-underline"
              >
                <div className="flex flex-col text-center items-center p-5">
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
                  <div className="text-lg font-medium mb-2">{title}</div>
                  <div className="text-md font-normal">
                    {summary.slice(0, 100)} ...
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </MaxWidth>
  );
}
