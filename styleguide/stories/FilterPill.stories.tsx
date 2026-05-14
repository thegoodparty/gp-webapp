import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FilterPill, FilterPillGroup } from '../components/ui/filter-pill'

const meta: Meta<typeof FilterPillGroup> = {
  title: 'Components/FilterPill',
  component: FilterPillGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FilterPillGroup>

export const Default: Story = {
  render: () => (
    <FilterPillGroup>
      <FilterPill value="city-council">City Council (12)</FilterPill>
      <FilterPill value="mayor">Mayor (3)</FilterPill>
      <FilterPill value="school-board">School Board (8)</FilterPill>
      <FilterPill value="sheriff">Sheriff (2)</FilterPill>
    </FilterPillGroup>
  ),
}
