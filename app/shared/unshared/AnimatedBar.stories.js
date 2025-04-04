import {
  ANIMATED_PROGRESS_BAR_SIZES,
  AnimatedProgressBar,
} from 'app/(candidate)/dashboard/components/p2v/AnimatedProgressBar';

export default {
  title: 'Unshared/AnimatedBar',
  component: AnimatedProgressBar,
  tags: ['autodocs'],
  args: {
    percent: 60,
    bgColor: 'bg-purple-500',
    size: ANIMATED_PROGRESS_BAR_SIZES.SM,
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3">
        <strong>(Used in dashboard / campaign tracker)</strong>
        <AnimatedProgressBar {...args} />
        <AnimatedProgressBar {...args} percent={80} bgColor="bg-green-500" />
        <AnimatedProgressBar {...args} percent={40} bgColor="bg-orange-500" />
        <AnimatedProgressBar {...args} percent={20} bgColor="bg-red-500" />
      </div>
    );
  },
};

export const Default = {};
