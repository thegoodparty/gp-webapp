import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import Link from 'next/link';
import WarningButton from '@shared/buttons/WarningButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H5 from '@shared/typography/H5';
import Body2 from '@shared/typography/Body2';

export default function Blog(props) {
  const { content, blogCTA = false, blogDark = false, blogItems = 3 } = props;

  let blogColSpan = blogCTA ? 'col-span-12 lg:col-span-6' : 'col-span-12';
  let blogItemsColSpan =
    blogItems === 3 ? 'col-span-12 lg:col-span-4' : 'col-span-12 lg:col-span-6';
  let blogImageSize = blogCTA
    ? 'w-full lg:w-[200px] h-[300px] lg:h-[200px]'
    : 'w-full lg:w-[300px] h-[300px]';
  let blogMaxWidth = blogCTA ? 'lg:max-w-[200px]' : 'lg:max-w-[300px]';

  let blogBgColor = blogDark ? 'bg-indigo-800' : 'bg-slate-50';
  let blogFontTitle = blogDark ? 'text-slate-50' : 'text-indigo-800';
  let blogFontSubtitle = blogDark ? 'text-slate-700' : 'text-indigo-800';

  return (
    <section className={`${blogBgColor} h-auto pb-20`}>
      <MaxWidth>
        <div className="grid grid-cols-12 md:justify-items-center">
          {blogCTA && (
            <div className="col-span-12 lg:col-span-6 w-full h-full py-10 lg:py-0">
              <div className="flex flex-col w-full h-full justify-center">
                <span className="text-xl font-medium text-left pb-5">
                  Want to get involved?
                </span>
                <span className="text-4xl font-semibold text-left py-5">
                  Good Party community
                </span>
                <span
                  className={`${blogFontSubtitle} text-xl font-normal text-left py-5`}
                >
                  Meet and take action with like-minded people passionate about
                  supporting independent and third-party candidates. Join for
                  political discussion, volunteer opportunities, and more!
                </span>

                <div className="flex w-full  pt-10">
                  <a href="/volunteer">
                    <PrimaryButton>Join our community</PrimaryButton>
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className={`${blogColSpan} lg:p-10 lg:pb-0 w-full`}>
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
                  <div key={id} className={`${blogItemsColSpan}`}>
                    <Link
                      id={slug}
                      href={`/blog/article/${slug}`}
                      className="no-underline"
                    >
                      <div className="flex flex-col text-start items-center p-5">
                        <div className={`${blogMaxWidth}`}>
                          {mainImage && (
                            <div className={`flex relative ${blogImageSize}`}>
                              <Image
                                src={`https:${mainImage.url}`}
                                alt={mainImage.alt}
                                sizes="100vw"
                                fill
                                className="object-cover object-center rounded-2xl"
                              />
                            </div>
                          )}
                          <H5 className="my-4 line-clamp-3">{title}</H5>
                          <Body2 className="line-clamp-2">{summary}</Body2>

                          <Link
                            href={`/blog/article/${slug}`}
                            className="flex justify-center mt-6"
                          >
                            <PrimaryButton size="medium">
                              Read more
                            </PrimaryButton>
                          </Link>
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
