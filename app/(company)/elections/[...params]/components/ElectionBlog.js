import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function Blog(props) {
  const { content, blogCTA = false, blogDark = false, blogItems = 3 } = props;

  let blogColSpan = blogCTA ? 'col-span-12 lg:col-span-6' : 'col-span-12';
  let blogItemsColSpan =
    blogItems === 3 ? 'col-span-12 lg:col-span-4' : 'col-span-12 lg:col-span-6';
  let blogImageSize = blogCTA ? 'w-[200px] h-[200px]' : 'w-[300px] h-[300px]';
  let blogMaxWidth = blogCTA ? 'max-w-[200px]' : 'max-w-[300px]';

  let blogBgColor = blogDark ? 'bg-indigo-800' : 'bg-slate-50';
  let blogFontTitle = blogDark ? 'text-slate-50' : 'text-indigo-800';
  let blogFontSubtitle = blogDark ? 'text-slate-700' : 'text-indigo-800';
  let blogTitleSize = blogCTA ? 'text-md' : 'text-2xl';
  let blogSubtitleSize = blogCTA ? 'text-md' : 'text-lg';

  return (
    <section className={`${blogBgColor} h-auto pb-20`}>
      <MaxWidth>
        <div className="grid grid-cols-12 md:justify-items-center pt-10">
          {blogCTA && (
            <div className="col-span-12 lg:col-span-6 p-10 w-full h-full">
              <div className="flex flex-col w-full h-full justify-center">
                <span className="text-xl font-medium text-left p-5">
                  Want to get involved?
                </span>
                <span className="text-4xl font-semibold text-left p-5">
                  Good Party community
                </span>
                <span
                  className={`${blogFontSubtitle} text-xl font-normal text-left p-5`}
                >
                  Meet and take action with like-minded people passionate about
                  supporting independent and third-party candidates. Join for
                  political discussion, volunteer opportunities, and more!
                </span>

                <div className="flex w-full justify-center pt-10">
                  <a href="/volunteer">
                    <PrimaryButton>Join our community</PrimaryButton>
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className={`${blogColSpan} p-10 w-full`}>
            <div className="flex items-center justify-center w-full mb-12">
              <h3
                className={`font-semibold ${blogFontTitle} text-[40px] mt-5 mb-5`}
              >
                Our blog
              </h3>
            </div>

            <div className="grid grid-cols-12 gap-3 mb-20 justify-items-center">
              {content.articles.slice(0, blogItems).map((article) => {
                const { id, title, mainImage, summary, slug } = article;
                return (
                  <div key={id} className={`flex ${blogItemsColSpan}`}>
                    <Link
                      id={slug}
                      href={`/blog/article/${slug}`}
                      className="no-underline"
                    >
                      <div className="flex flex-col text-start items-center p-5">
                        {mainImage && (
                          <div className={`flex relative ${blogImageSize}`}>
                            <Image
                              src={`https:${mainImage.url}`}
                              alt={mainImage.alt}
                              sizes="100vw"
                              fill
                              className="object-cover object-top rounded-2xl"
                            />
                          </div>
                        )}
                        <div
                          className={`${blogTitleSize} ${blogFontTitle} font-semibold mb-2 ${blogMaxWidth} mt-3`}
                        >
                          {title}
                        </div>
                        <div
                          className={`${blogSubtitleSize} ${blogFontSubtitle} font-sfpro font-normal ${blogMaxWidth}`}
                        >
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
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
