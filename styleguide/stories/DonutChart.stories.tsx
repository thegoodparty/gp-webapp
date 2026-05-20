import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DonutChart } from '../components/ui/donut-chart'

const meta: Meta<typeof DonutChart> = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DonutChart>

const yesNoData = [
  { name: 'Yes', value: 38 },
  { name: 'No', value: 62 },
]

const homeownerData = [
  { name: 'Owner', value: 54 },
  { name: 'Renter', value: 31 },
  { name: 'Unknown', value: 15 },
]

export const TwoSegments: Story = {
  render: () => (
    <div className="w-[420px]">
      <DonutChart data={yesNoData} percentage />
    </div>
  ),
}

export const ThreeSegments: Story = {
  render: () => (
    <div className="w-[420px]">
      <DonutChart data={homeownerData} percentage />
    </div>
  ),
}

export const Counts: Story = {
  render: () => (
    <div className="w-[420px]">
      <DonutChart
        data={homeownerData.map((d) => ({ ...d, value: d.value * 1000 }))}
      />
    </div>
  ),
}
