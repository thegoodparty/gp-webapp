import MaxWidth from '@shared/layouts/MaxWidth';

export default function Help() {
  return (
    <div className="bg-white p-3 absolute bottom-0 left-0 w-screen">
      <MaxWidth>
        <div className="text-right">
          <strong>Need help?</strong> Email us at:{' '}
          <a
            href="mailto:politics@goodparty.org"
            className="text-purple underline"
          >
            politics@goodparty.org
          </a>
        </div>
      </MaxWidth>
    </div>
  );
}
