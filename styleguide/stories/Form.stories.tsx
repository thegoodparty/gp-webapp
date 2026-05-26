import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Form>

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

type PlaygroundArgs = {
  label: string
  description: string
  placeholder: string
  required: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    label: 'Email',
    description: 'Your email will remain private.',
    placeholder: 'Enter your email',
    required: true,
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
  },
  render: ({ label, description, placeholder, required }) => {
    const Demo = () => {
      const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
      })
      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {label}
                    {required ? ' *' : ''}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  {description ? (
                    <FormDescription>{description}</FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <Demo />
  },
}

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
      })
      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your email will remain private.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <Demo />
  },
}

export const WithValidationError: Story = {
  render: () => {
    const Demo = () => {
      const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: 'not-an-email' },
      })
      useEffect(() => {
        form.setError('email', {
          type: 'manual',
          message: 'Please enter a valid email address.',
        })
      }, [form])
      return (
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <Demo />
  },
}

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

export const MultipleFields: Story = {
  render: () => {
    const Demo = () => {
      const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '', email: '' },
      })
      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  render: () => {
    const Demo = () => {
      const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: 'reader@example.com' },
      })
      return (
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" disabled {...field} />
                  </FormControl>
                  <FormDescription>
                    Email is read-only for this account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled>
              Submit
            </Button>
          </form>
        </Form>
      )
    }
    return <Demo />
  },
}
