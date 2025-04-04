import Table from './Table'

const mockData = {
  columns: [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Job',
      accessor: 'job',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Years of Experience',
      accessor: 'experience',
    },
  ],
  data: [
    {
      name: 'Pete Peterson',
      age: 34,
      job: 'Window Washer',
      location: 'Chicago',
      experience: 5,
    },
    {
      name: 'Andy Anderson',
      age: 25,
      job: 'Doctor',
      location: 'New York',
      experience: 2,
    },
    {
      name: 'Rob Robson',
      age: 33,
      job: 'Author',
      location: 'San Francisco',
      experience: 10,
    },
    {
      name: 'Bob Bobson',
      age: 47,
      job: 'Football Star',
      location: 'Miami',
      experience: 20,
    },
    {
      name: 'Jane Johnson',
      age: 29,
      job: 'Engineer',
      location: 'Seattle',
      experience: 7,
    },
    {
      name: 'Sara Sanders',
      age: 40,
      job: 'Teacher',
      location: 'Dallas',
      experience: 15,
    },
    {
      name: 'Tommy Thompson',
      age: 52,
      job: 'Chef',
      location: 'Las Vegas',
      experience: 25,
    },
    {
      name: 'Emily Evans',
      age: 22,
      job: 'Graphic Designer',
      location: 'Austin',
      experience: 1,
    },
    {
      name: 'Michael Miller',
      age: 45,
      job: 'Architect',
      location: 'Los Angeles',
      experience: 18,
    },
    {
      name: 'Rachel Roberts',
      age: 38,
      job: 'Nurse',
      location: 'Boston',
      experience: 12,
    },
    {
      name: 'Lucy Liu',
      age: 30,
      job: 'Software Developer',
      location: 'San Diego',
      experience: 6,
    },
    {
      name: 'David Davidson',
      age: 28,
      job: 'Marketing Specialist',
      location: 'Denver',
      experience: 3,
    },
    {
      name: 'Linda Lopez',
      age: 42,
      job: 'Accountant',
      location: 'Phoenix',
      experience: 15,
    },
    {
      name: 'Gary Grant',
      age: 55,
      job: 'Pilot',
      location: 'Orlando',
      experience: 30,
    },
    {
      name: 'Mona Martinez',
      age: 36,
      job: 'Sales Manager',
      location: 'Houston',
      experience: 14,
    },
  ],
}

export default {
  title: 'Utils/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    ...mockData,
  },
}

export const Default = {}
