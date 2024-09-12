'use client';

import { useEffect, useState } from 'react';
import { times } from 'lodash';
import Image from 'next/image';
import MarketingH3 from '@shared/typography/MarketingH3';
import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import Subtitle2 from '@shared/typography/Subtitle2';
import Button from '@shared/buttons/Button';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const LG_PAGE_SIZE = 3;
const MD_PAGE_SIZE = 2;
const SM_PAGE_SIZE = 1;
const LG_MIN = 1024;
const MD_MIN = 768;

const testimonials = [
  {
    name: 'Joe Jernigan von Jenson de Jonson',
    office: 'Candidate for SC House District 111',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/7iXcLSYYfoG6KuzALoEuSo/5cae482b9311ad4ac6cbf959f5560c0d/Joe_Jernigan.jpg',
      alt: 'Joe Jernigan',
    },
    testimonial:
      "The best tool GoodParty.org has to offer for Political Campaigns, is the AI tool that takes YOUR ideas/goals and inserts them into a beautifully-written statement, reflecting what you input! This has proven excellent for me, as I've used to it partially craft some of my Official Campaign Statements!",
  },
  {
    name: 'Japjeet Uppal',
    office: 'Candidate for Livingston, CA City Council',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5aOMolTAK1apiOWJl3Xuvt/d4d4994aa4465365fd45074cc2508be8/Japjeet_Uppal.jpg',
      alt: 'Japjeet Uppal',
    },
    testimonial:
      "It's wild to me still that I get to do all of this for free. I very much appreciate GoodParty.org's mission and that there's people like you who are willing to put the time in to invest in folks like me all across the country, because we 100% need it.",
  },
  {
    name: 'Mary Anderson',
    office: 'Candidate for Snohomish, County WA Judge',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5F56YyUMfJViMshnO52CDZ/8f072f7e875deb4d33aa1537efe57899/Mary_Anderson.jpg',
      alt: 'Mary Anderson',
    },
    testimonial:
      "With respect to the tools that GoodParty.org offers, I think it's absolutely phenomenal for me: the AI, the tracking, the ability to actually see the progress on how well you're doing and what you need to do.",
  },
  {
    name: 'Borton Bort',
    office: 'Candidate for Bloopberg, County WA Judge',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5F56YyUMfJViMshnO52CDZ/8f072f7e875deb4d33aa1537efe57899/Mary_Anderson.jpg',
      alt: 'Mary Anderson',
    },
    testimonial:
      'kdfjskf sldkjf lsdkfj sdlkfj sldkfj lsdkfj sdlkfj sldkf jlsdkfj dlskfj lsdkfj lsdkfj lksjf lksdjf lksdjf lks',
  },
  {
    name: 'Jenny Joni',
    office: 'Judge forever and ever',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5aOMolTAK1apiOWJl3Xuvt/d4d4994aa4465365fd45074cc2508be8/Japjeet_Uppal.jpg',
      alt: 'Japjeet Uppal',
    },
    testimonial:
      'fdslkfjdslk sldkfj sdlkfj sdlkfj lskdfj lskdjf lsdkjf lskdj flksdj flskdjf lksdj flksdj flskd jflksdj flks jf.',
  },
  {
    name: 'Patrick Porkins',
    office: 'Candidate for SC House District 111',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/7iXcLSYYfoG6KuzALoEuSo/5cae482b9311ad4ac6cbf959f5560c0d/Joe_Jernigan.jpg',
      alt: 'Joe Jernigan',
    },
    testimonial:
      'fkdjs lkdsjf sdlkfj lksdfj lsdkfj lsdkfj lsdkjf lkdsjf lksdjf ldskfj ldskfj lsdk',
  },
  {
    name: 'Amy Amyson',
    office: 'Candidate for Snohomish, County WA Judge',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5F56YyUMfJViMshnO52CDZ/8f072f7e875deb4d33aa1537efe57899/Mary_Anderson.jpg',
      alt: 'Mary Anderson',
    },
    testimonial:
      'KDFJSDKPFJ S:KDFJ SD:KF JSDKF JSLDKF JLJFKSLDJF LKSDJF KLSJDFLKSDJ FKLSDJ FLKSDJ FLKSDJF KLSDJ FKLDS fjSK',
  },
  {
    name: 'Japjeet Uppal',
    office: 'Candidate for Livingston, CA City Council',
    image: {
      url: '//images.ctfassets.net/g08ybc4r0f4b/5aOMolTAK1apiOWJl3Xuvt/d4d4994aa4465365fd45074cc2508be8/Japjeet_Uppal.jpg',
      alt: 'Japjeet Uppal',
    },
    testimonial:
      "It's wild to me still that I get to do all of this for free. I very much appreciate GoodParty.org's mission and that there's people like you who are willing to put the time in to invest in folks like me all across the country, because we 100% need it.",
  },
];

function PageDot({ pageNum, isSelected, onClick }) {
  return (
    <span
      onClick={onClick}
      role="button"
      title={'Page ' + ++pageNum}
      className={`inline-block rounded-full h-2 w-2 mx-1 ${
        isSelected ? 'bg-primary-main' : 'bg-black/[0.38]'
      }`}
    ></span>
  );
}

export default function Testimonials({ testimonials }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(SM_PAGE_SIZE);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);

    function handleResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= LG_MIN) {
        setPageSize(windowWidth <= MD_MIN ? SM_PAGE_SIZE : MD_PAGE_SIZE);
      } else {
        setPageSize(LG_PAGE_SIZE);
      }
    }
  }, []);

  if (!testimonials || testimonials.length <= 0) return null;

  const hasPages = testimonials.length > pageSize;
  const lastPage = Math.floor((testimonials.length - 1) / pageSize);
  const startIndex = currentPage * pageSize;

  function incrementPage() {
    const nextPage = currentPage < lastPage ? currentPage + 1 : lastPage;

    setCurrentPage(nextPage);
  }

  function decrementPage() {
    const nextPage = currentPage > 0 ? currentPage - 1 : 0;

    setCurrentPage(nextPage);
  }

  function goToPage(pageNum) {
    if (pageNum >= 0 && pageNum <= lastPage) setCurrentPage(pageNum);
  }

  return (
    <section className="box-content max-w-screen-xl mx-auto py-16 px-8">
      <MarketingH3 className="block text-center">
        Candidates
        <Image
          className="inline align-middle mx-4"
          src="/images/logo-hologram-white.svg"
          alt="heart"
          width={70}
          height={70}
        />
        us
      </MarketingH3>
      <Body1 className="mt-4 text-center">
        Our tools are trusted by over 2,500 candidates actively running for
        office nationwide.
      </Body1>
      <div className="px-6 py-8 grid grid-cols-12 gap-6">
        {testimonials
          .slice(startIndex, startIndex + pageSize)
          .map(({ name, office, image, testimonial }) => (
            <div
              key={name + office}
              className={`col-span-${
                12 / pageSize
              } p-12 bg-white border rounded-md`}
            >
              <div className="flex gap-2 items-center">
                <Image
                  className="rounded-md self-start"
                  src={'https:' + image.url}
                  alt={image.alt}
                  width={70}
                  height={70}
                />
                <div>
                  <H3>{name}</H3>
                  <Subtitle2 className="text-tertiary">{office}</Subtitle2>
                </div>
              </div>
              <Body1 className="mt-6">{testimonial}</Body1>
            </div>
          ))}
        {hasPages && (
          <div className="col-span-12 flex gap-x-12 items-center justify-center">
            <Button
              disabled={currentPage === 0}
              onClick={decrementPage}
              variant="text"
              size="large"
              className="flex items-center gap-2"
            >
              <MdArrowBack className="text-2xl" />
              Back
            </Button>
            <div>
              {times(lastPage + 1).map((pageNum) => (
                <PageDot
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  pageNum={pageNum}
                  isSelected={pageNum === currentPage}
                />
              ))}
            </div>
            <Button
              disabled={currentPage === lastPage}
              onClick={incrementPage}
              variant="text"
              size="large"
              className="flex items-center gap-2"
            >
              Next
              <MdArrowForward className="text-2xl" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
