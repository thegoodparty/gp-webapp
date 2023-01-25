import EmailForm from '@shared/inputs/EmailForm';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function SubscribeSection() {
  return (
    <section className="bg-zinc-100 py-12 text-center">
      <MaxWidth>
        <h3 className="font-black text-3xl lg:text-5xl mb-3">
          GET ON THE LIST
        </h3>
        <div className="text-lg font-light lg:w-[80%] mx-auto">
          Subscribe to our newsletter to get regular content about Good Party's
          efforts. We'll share what's new in the movement, highlight Good Party
          Certified candidates, and opportunities to get involved to give you
          hope that a better democracy is possible.
        </div>
        <div className="mx-auto lg:w-[50%]">
          <EmailForm
            fullWidth
            forId="46116311-525b-42a2-b88e-d2ab86f26b8a"
            pageName="Home Page"
          />
        </div>
      </MaxWidth>
    </section>
  );
}
