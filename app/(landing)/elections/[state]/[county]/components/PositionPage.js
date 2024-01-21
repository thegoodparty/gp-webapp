import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import { slugify } from 'helpers/articleHelper';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import { shortToLongState } from 'helpers/statesHelper';
import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';

export default function PositionPage(props) {
  const { race } = props;
  const { data, county, municipality } = race;
  if (!data.state) {
    return null;
  }
  const stateName = shortToLongState[data.state];
  const breadcrumbsLinks = [
    { href: `/elections`, label: 'How to run' },
    {
      label: `how to run in ${stateName}`,
      href: `/elections/${data.state.toLowerCase()}`,
    },
    {
      label: data.position_name,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <H1 className="pt-12 pb-6">{data.position_name}</H1>
        <H3>{data.position_description}</H3>

        <H2 className="mt-12">Race data</H2>
        <div className="grid grid-cols-12 gap-6 mt-6">
          {Object.keys(data).map((key) => (
            <div key={key} className=" col-span-12 md:col-span-6 lg:col-span-4">
              <div className=" font-semibold">{key}</div>
              <div className="mt-2 mb-6">{data[key]}</div>
            </div>
          ))}
        </div>

        {municipality && municipality.data ? (
          <>
            <hr />
            <H2 className="mt-12">Municipality data</H2>
            <div className="grid grid-cols-12 gap-6 mt-6">
              {Object.keys(municipality.data).map((key) => (
                <div
                  key={key}
                  className=" col-span-12 md:col-span-6 lg:col-span-3"
                >
                  <div className=" font-semibold">{key}</div>
                  <div className="mt-2 mb-6">{municipality.data[key]}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {county && county.data ? (
          <>
            <hr />
            <H2 className="mt-12">County data</H2>
            <div className="grid grid-cols-12 gap-6 mt-6">
              {Object.keys(county.data).map((key) => (
                <div
                  key={key}
                  className=" col-span-12 md:col-span-6 lg:col-span-3"
                >
                  <div className=" font-semibold">{key}</div>
                  <div className="mt-2 mb-6">{county.data[key]}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </MaxWidth>
    </div>
  );
}
