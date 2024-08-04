import MaxWidth from '@shared/layouts/MaxWidth';
import Paper from '@shared/utils/Paper';

export default function CardPageWrapper({ children }) {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[75vw]">
            <Paper className="p-5 md:p-8 lg:p-12">{children}</Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
