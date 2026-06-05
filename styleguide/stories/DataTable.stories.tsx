import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  DataTableSelectCheckbox,
  DataTableSelectRowCheckbox,
} from '@styleguide/components/ui/data-table'
import { Badge } from '@styleguide/components/ui/badge'
import { Button } from '@styleguide/components/ui/button'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data types
interface Payment {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive'
  createdAt: string
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

// Sample data
const samplePayments: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'abe45@example.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'monserrat44@example.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'silas22@example.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: 'x8k2m9n1',
    amount: 459,
    status: 'pending',
    email: 'john.doe@example.com',
  },
  {
    id: 'q7w3e5r2',
    amount: 623,
    status: 'processing',
    email: 'jane.smith@example.com',
  },
]

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-25',
  },
]

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 25,
    status: 'in-stock',
  },
  {
    id: '2',
    name: 'Coffee Mug',
    category: 'Kitchen',
    price: 12.99,
    stock: 5,
    status: 'low-stock',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    category: 'Office',
    price: 49.99,
    stock: 0,
    status: 'out-of-stock',
  },
  {
    id: '4',
    name: 'Notebook Set',
    category: 'Stationery',
    price: 24.99,
    stock: 50,
    status: 'in-stock',
  },
]

// Payment columns
const paymentColumns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => <DataTableSelectCheckbox table={table} />,
    cell: ({ row }) => <DataTableSelectRowCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant =
        status === 'success'
          ? 'default'
          : status === 'processing'
          ? 'secondary'
          : status === 'failed'
          ? 'destructive'
          : 'outline'

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: 'Copy payment ID',
              onClick: () => navigator.clipboard.writeText(payment.id),
            },
            {
              label: 'View customer',
              onClick: () => console.log('View customer:', payment.email),
            },
            {
              label: 'View payment details',
              onClick: () => console.log('View payment:', payment),
            },
          ]}
        />
      )
    },
  },
]

// User columns
const userColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => <DataTableSelectCheckbox table={table} />,
    cell: ({ row }) => <DataTableSelectRowCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={status === 'active' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: 'Edit user',
              onClick: () => console.log('Edit user:', user),
            },
            {
              label: 'View profile',
              onClick: () => console.log('View profile:', user),
            },
            {
              label: 'Delete user',
              onClick: () => console.log('Delete user:', user),
              variant: 'destructive',
            },
          ]}
        />
      )
    },
  },
]

// Product columns
const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant =
        status === 'in-stock'
          ? 'default'
          : status === 'low-stock'
          ? 'secondary'
          : 'destructive'

      return (
        <Badge variant={variant} className="capitalize">
          {status.replace('-', ' ')}
        </Badge>
      )
    },
  },
]

export const Default: Story = {
  args: {
    columns: paymentColumns,
    data: samplePayments,
    searchKey: 'email',
    searchPlaceholder: 'Filter emails...',
  },
}

export const WithUsers: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    searchKey: 'name',
    searchPlaceholder: 'Filter names...',
  },
}

export const WithProducts: Story = {
  args: {
    columns: productColumns,
    data: sampleProducts,
    searchKey: 'name',
    searchPlaceholder: 'Filter products...',
  },
}

export const NoSearch: Story = {
  args: {
    columns: paymentColumns,
    data: samplePayments,
  },
}

export const EmptyState: Story = {
  args: {
    columns: paymentColumns,
    data: [],
    searchKey: 'email',
    searchPlaceholder: 'Filter emails...',
  },
}

export const MinimalColumns: Story = {
  args: {
    columns: [
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }: { row: any }) => {
          const amount = parseFloat(row.getValue('amount'))
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
        },
      },
    ],
    data: samplePayments,
    searchKey: 'email',
  },
}

// Interactive example with custom actions
function InteractiveExample() {
  const handleRowAction = (action: string, row: Payment) => {
    alert(`${action}: ${row.email} - ${row.amount}`)
  }

  const interactiveColumns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => <DataTableSelectCheckbox table={table} />,
      cell: ({ row }) => <DataTableSelectRowCheckbox row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const variant =
          status === 'success'
            ? 'default'
            : status === 'processing'
            ? 'secondary'
            : status === 'failed'
            ? 'destructive'
            : 'outline'

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => handleRowAction('Edit', row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="small"
            onClick={() => handleRowAction('Delete', row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={interactiveColumns}
      data={samplePayments}
      searchKey="email"
      searchPlaceholder="Search by email..."
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
}

export const ServerSidePagination: Story = {
  args: {
    columns: paymentColumns,
    data: samplePayments,
    searchKey: 'email',
    searchPlaceholder: 'Filter emails...',
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DataTable with pagination disabled for server-side pagination implementations.',
      },
    },
  },
}

export const NoPagination: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    searchKey: 'name',
    searchPlaceholder: 'Filter names...',
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DataTable without pagination controls, useful when you want to handle pagination externally.',
      },
    },
  },
}
