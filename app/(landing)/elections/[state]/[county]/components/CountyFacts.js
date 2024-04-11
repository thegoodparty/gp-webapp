import { FaCity, FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6';
import { MdOutlineWorkOff } from 'react-icons/md';
import { SlWallet } from 'react-icons/sl';
import { TbHomeShare } from 'react-icons/tb';
import { numberFormatter } from 'helpers/numberHelper';

export default function CountyFacts({ county }) {
  console.log('county', county);
  const {
    city_largest,
    population,
    density,
    income_household_median,
    unemployment_rate,
    home_value,
  } = county;

  const fields = [
    { label: 'Largest city', value: city_largest, icon: <FaCity /> },
    {
      label: 'Population',
      value: population,
      icon: <FaPeopleGroup />,
      isNumber: true,
    },
    { label: 'Density', value: `${density} per Sq KM`, icon: <FaPeopleRoof /> },
    {
      label: 'Median income',
      value: income_household_median,
      icon: <SlWallet />,
      isNumber: true,
    },
    {
      label: 'Unemployment rate',
      value: unemployment_rate,
      icon: <MdOutlineWorkOff />,
      isPercent: true,
    },
    {
      label: 'Home Value',
      value: home_value,
      icon: <TbHomeShare />,
      isNumber: true,
      isMoney: true,
    },
  ];

  return (
    <section className="bg-primary py-14 md:py-20  mt-12 md:mt-20">
      <div className="max-w-screen-xl mx-auto mt-20 text-slate-50">
        <h3 className=" text-2xl md:text-5xl font-semibold text-center mb-12 md:mb-20">
          {county.county_full} Fast facts
        </h3>
        <div className="grid grid-cols-12 gap-4">
          {fields.map((field) => (
            <div
              key={field.label}
              className="col-span-6 md:col-span-4 flex flex-col items-center"
            >
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#2AC8E2] to-[#8578ED] flex items-center justify-center text-3xl md:text-5xl text-primary">
                {field.icon}
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-semibold">{field.label}</div>
                <div className="text-lg text-slate-200 mt-2 mb-10">
                  {field.isMoney ? '$' : ''}
                  {field.isNumber ? numberFormatter(field.value) : field.value}
                  {field.isPercent ? '%' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
