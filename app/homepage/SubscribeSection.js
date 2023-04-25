import EmailForm from '@shared/inputs/EmailForm';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function SubscribeSection({ pageName = 'Home Page' }) {
  return (
    <section className="bg-zinc-100 py-12 text-center mt-16">
      <MaxWidth>
        <h3 className="font-black text-3xl lg:text-5xl mb-3">
          GET ON THE LIST
        </h3>
        <div className="text-lg font-light lg:w-[80%] mx-auto text-left lg:text-center">
          Subscribe to our newsletter to get regular content about Good
          Party&apos;s efforts. We&apos;ll share what&apos;s new in the
          movement, highlight Good Party Certified candidates, and opportunities
          to get involved to give you hope that a better democracy is possible.
        </div>
        <div className="mx-auto lg:w-[50%]">
          <EmailForm
            fullWidth
            formId="5d84452a-01df-422b-9734-580148677d2c"
            pageName={pageName}
            labelId="subscribe-form"
          />
        </div>
      </MaxWidth>
    </section>
  );
}
