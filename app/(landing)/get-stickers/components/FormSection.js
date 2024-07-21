import MaxWidth from '@shared/layouts/MaxWidth';
import HubSpotForm from '@shared/utils/HubSpotForm';

export default function FormSection() {
  return (
    <section className="my-8">
      <MaxWidth>
        <h3 className="text-2xl md:text-3xl text-center font-medium mb-8">
          Get Your Stickers!
        </h3>
        <div className="max-w-screen-sm mx-auto">
          <HubSpotForm formId="79c20f29-c2af-4e6c-9e89-f4d0eb6db166" />
        </div>
      </MaxWidth>
    </section>
  );
}
