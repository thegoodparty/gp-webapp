import MaxWidth from '@shared/layouts/MaxWidth';

export default function Steps({ campaignSteps, campaignStatus }) {
  return (
    <MaxWidth>
      <div className=" rounded-2xl mt-6">
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {campaignSteps.map((step) => (
            <div className="col-span-12 lg:col-span-4 h-full" key={step.key}>
              <div className=" bg-white rounded-xl h-full">
                <div className="px-6 py-8">
                  <div className="inline-block rounded">{step.icon}</div>
                  <h3 className="font-bold text-3xl mt-3">{step.title}</h3>
                  <h4 className="text-zinc-500 mt-3 leading-relaxed">
                    {step.subTitle}
                  </h4>
                </div>
                <div className="flex justify-between items-center px-6 py-4 border-b-2 border-slate-100 text-sm">
                  <div className="">
                    <div
                      className={`font-black ${
                        campaignStatus[step.key]?.status === 'Completed' &&
                        ' text-green-600'
                      }  ${
                        campaignStatus[step.key]?.status === 'In Progress' &&
                        ' text-orange-600'
                      } ${
                        campaignStatus[step.key]?.status === 'Not Started' &&
                        ' text-gray-600'
                      }`}
                    >
                      {campaignStatus[step.key]?.status}
                    </div>
                    <div className="mt-1">
                      {campaignStatus[step.key]?.completedSteps || 0} of{' '}
                      {step.steps.length} steps
                    </div>
                  </div>
                  <div>
                    {campaignStatus[step.key]?.status === 'Completed' && (
                      <div className="underline text-gray-600 px-6 py-4  font-bold">
                        View Details
                      </div>
                    )}
                    {campaignStatus[step.key]?.status === 'In Progress' && (
                      <div className="bg-orange-500 text-white px-12 py-4 rounded-full  font-black">
                        Continue
                      </div>
                    )}
                    {campaignStatus[step.key]?.status === 'Not Started' && (
                      <div className="underline text-gray-600 px-6 py-4  font-bold">
                        View Steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidth>
  );
}
