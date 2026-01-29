import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const WithCustomStyling: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell className="text-right">Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">002</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell className="text-right">User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithStripedRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          {
            product: 'Laptop',
            category: 'Electronics',
            price: '$999',
            stock: '10',
          },
          {
            product: 'Smartphone',
            category: 'Electronics',
            price: '$699',
            stock: '15',
          },
          {
            product: 'Headphones',
            category: 'Audio',
            price: '$199',
            stock: '20',
          },
          {
            product: 'Keyboard',
            category: 'Accessories',
            price: '$99',
            stock: '25',
          },
        ].map((item, index) => (
          <TableRow
            key={index}
            className={index % 2 === 0 ? 'bg-muted/50' : ''}
          >
            <TableCell className="font-medium">{item.product}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell className="text-right">{item.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithHoverEffect: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          {
            task: 'Design Review',
            status: 'In Progress',
            priority: 'High',
            dueDate: '2024-03-20',
          },
          {
            task: 'Code Implementation',
            status: 'Pending',
            priority: 'Medium',
            dueDate: '2024-03-25',
          },
          {
            task: 'Testing',
            status: 'Not Started',
            priority: 'Low',
            dueDate: '2024-03-30',
          },
        ].map((item, index) => (
          <TableRow key={index} className="hover:bg-muted/50 cursor-pointer">
            <TableCell className="font-medium">{item.task}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.priority}</TableCell>
            <TableCell className="text-right">{item.dueDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
