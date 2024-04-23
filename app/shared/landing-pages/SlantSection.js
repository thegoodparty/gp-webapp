import { theme } from '../../../tailwind.config';

export const DEFAULT_SLANT_SECTION_COLORS = ['rgba(0,0,0,0)', theme.extend.colors.primary.dark, 'rgba(0,0,0,0)'];
export const SlantSection = ({
  colors = DEFAULT_SLANT_SECTION_COLORS,
  children,
}) => {
  if (colors.length !== 3) {
    throw new Error('SlantSection must be implemented w/ exactly 3 colors');
  }
  return <section>
    <div
      className={`bg-[linear-gradient(176deg,_${colors[0]}_54.5%,_${colors[1]}_55%)] h-[calc(100vw*0.09)] w-full`}
    />
    {children}
    <div
      className={`bg-[linear-gradient(176deg,_${colors[1]}_54.5%,_${colors[2]}_55%)] h-[calc(100vw*0.09)] w-full`}
    />
  </section>;
};
