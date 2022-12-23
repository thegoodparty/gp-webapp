import MaxWidth from '@shared/layouts/MaxWidth';

export default function Title() {
  return (
    <>
      <MaxWidth>
        <h1
          className="my-6 text-4xl font-black lg:mt-16 lg:mb-6 lg:text-6xl"
          data-cy="candidates-top-title"
        >
          Independent Candidates - Find An{' '}
          <span className="relative inline-block">
            <span className="z-10 relative">Independent Near You.</span>
            <div
              className="absolute bottom-0 h-5 lg:h-7 -left-1 lg:bottom-1"
              style={{ width: 'calc(100% + 10px)', backgroundColor: '#ffe600' }}
            />
          </span>
        </h1>
      </MaxWidth>
      <div
        className="hidden lg:block mt-10 mb-14 w-screen"
        style={{ height: '1px', borderBottom: 'solid 1px #f3f3f3' }}
      />
    </>
  );
}
