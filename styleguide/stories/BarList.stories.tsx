import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BarList } from '../components/ui/bar-list'

const meta: Meta<typeof BarList> = {
  title: 'Charts/BarList',
  component: BarList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BarList>

const educationData = [
  { name: 'None', value: 8 },
  { name: 'High School Diploma', value: 32 },
  { name: 'Some College', value: 18 },
  { name: 'Technical School', value: 6 },
  { name: 'College Degree', value: 24 },
  { name: 'Graduate Degree', value: 11 },
  { name: 'Unknown', value: 1 },
]

const ageData = [
  { name: '18-24', value: 12 },
  { name: '25-34', value: 21 },
  { name: '35-44', value: 19 },
  { name: '45-54', value: 17 },
  { name: '55-64', value: 16 },
  { name: '65+', value: 15 },
]

export const Percentage: Story = {
  render: () => (
    <div className="w-[640px]">
      <BarList data={educationData} percentage />
    </div>
  ),
}

export const Counts: Story = {
  render: () => (
    <div className="w-[640px]">
      <BarList data={ageData.map((d) => ({ ...d, value: d.value * 1000 }))} />
    </div>
  ),
}

export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[320px]">
      <BarList data={ageData} percentage />
    </div>
  ),
}

export const LongLabels: Story = {
  render: () => (
    <div className="w-[480px]">
      <BarList
        data={[
          { name: 'Some really long category label that overflows', value: 12 },
          { name: 'Another long-ish label', value: 28 },
          { name: 'Short', value: 60 },
        ]}
        percentage
      />
    </div>
  ),
}
