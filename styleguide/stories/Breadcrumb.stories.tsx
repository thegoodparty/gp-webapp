import { Fragment } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Breadcrumb>

type PlaygroundArgs = {
  depth: number
  withEllipsis: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    depth: 3,
    withEllipsis: false,
  },
  argTypes: {
    depth: {
      control: { type: 'number', min: 2, max: 8, step: 1 },
      description:
        'Number of crumbs to render, including Home and the current page.',
    },
    withEllipsis: {
      control: 'boolean',
      description:
        'Collapse middle crumbs into an ellipsis (only meaningful when depth > 3).',
    },
  },
  render: ({ depth, withEllipsis }) => {
    const names = [
      'Home',
      'Library',
      'Category',
      'Subcategory',
      'Section',
      'Topic',
      'Article',
      'Detail',
    ]
    const crumbs = names.slice(0, Math.max(2, Math.min(depth, names.length)))
    const last = crumbs.length - 1
    const collapseMiddle = withEllipsis && crumbs.length > 3
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((name, i) => {
            if (collapseMiddle && i > 0 && i < last) {
              if (i === 1) {
                return (
                  <Fragment key="ellipsis">
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                )
              }
              return null
            }
            return (
              <Fragment key={name}>
                <BreadcrumbItem>
                  {i === last ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">{name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i !== last ? <BreadcrumbSeparator /> : null}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Data</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Subcategory</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Item</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
