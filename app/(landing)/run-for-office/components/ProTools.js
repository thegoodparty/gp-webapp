import MaxWidth from '@shared/layouts/MaxWidth';

export default function ProTools() {
  return (
    <section className="relative">
      <div className="relative z-10">
        <MaxWidth smallFull>
          <div className="bg-white py-14 px-4 lg:p-14 lg:rounded-2xl">
            <h2 className="text-3xl lg:text-6xl font-semibold ">Pro tools</h2>
            <h3 className="text-xl lg:text-2xl font-semibold mt-10 mb-5">
              In addition to our free tools, for just $10/month...
            </h3>
          </div>
        </MaxWidth>
      </div>
      <div className="absolute h-1/2 w-full bg-primary bottom-0 left-0 hidden lg:block"></div>
    </section>
  );
}
