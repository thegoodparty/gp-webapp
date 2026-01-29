import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from '../components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChartContainer>

const data = [
  { name: 'A', value: 1 },
  { name: 'B', value: 2 },
  { name: 'C', value: 3 },
  { name: 'D', value: 4 },
  { name: 'E', value: 5 },
]

export const Default: Story = {
  render: () => (
    <ChartContainer config={{}}>
      <LineChart data={data} width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <ChartTooltip />
        <ChartLegend />
      </LineChart>
    </ChartContainer>
  ),
}
