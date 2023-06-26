'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';

export default function Blog(props) {
  const { content } = props;
  return (
    <section className="bg-indigo-800 h-auto pt-20 pb-20">
      <MaxWidth>
        <div className="flex items-center justify-center w-full mb-12">
          <h3 className="font-semibold text-slate-50 text-[40px] mt-5 mb-5">
            Our blog
          </h3>
        </div>

        <div className="grid grid-cols-12 gap-3 mb-20 justify-items-center">
          {content.articles.map((article) => {
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
                    <div className="text-2xl font-semibold text-slate-50 mb-2">
                      {title}
                    </div>
                    <div className="font-sfpro text-lg text-slate-700 font-normal">
                      {summary.slice(0, 100)} ...
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center p-3">
          <Link href="/blog">
            <WarningButton size="large">View more posts</WarningButton>
          </Link>
        </div>
      </MaxWidth>
    </section>
  );
}
