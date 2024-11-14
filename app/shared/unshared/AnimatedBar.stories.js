import { AnimatedBar } from 'app/(candidate)/dashboard/components/p2v/AnimatedBar';

export default {
  title: 'Unshared/AnimatedBar',
  component: AnimatedBar,
  tags: ['autodocs'],
  args: {
    contacted: 60,
    needed: 100,
    bgColor: 'bg-purple-500',
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3">
        <strong>(Used in dashboard / campaign tracker)</strong>
        <AnimatedBar {...args} />
        <AnimatedBar {...args} contacted={80} bgColor="bg-green-500" />
        <AnimatedBar {...args} contacted={20} bgColor="bg-red-500" />
        <AnimatedBar {...args} contacted={40} bgColor="bg-orange-500" />
      </div>
    );
  },
};

export const Default = {};
