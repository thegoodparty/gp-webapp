import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import {
  CalendarIcon,
  ChevronRightIcon,
  MenuIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from '../components/ui/icons'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['sidebar', 'floating', 'inset'],
      description: 'Visual variant of the sidebar shell.',
    },
    side: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Which side of the viewport the sidebar attaches to.',
    },
    collapsible: {
      control: 'inline-radio',
      options: ['offcanvas', 'icon', 'none'],
      description:
        'How the sidebar collapses: offcanvas slides it out, icon keeps a narrow rail, none disables collapse.',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const navItems = [
  { key: 'profile', label: 'Profile', icon: UserIcon },
  { key: 'events', label: 'Events', icon: CalendarIcon },
  { key: 'search', label: 'Search', icon: SearchIcon },
  { key: 'saved', label: 'Saved', icon: StarIcon },
]

const subItems = [
  { key: 'calls', label: 'Calls' },
  { key: 'texts', label: 'Texts' },
  { key: 'door-knocks', label: 'Door-knocks' },
]

type DemoProps = {
  variant?: 'sidebar' | 'floating' | 'inset'
  side?: 'left' | 'right'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

function SidebarDemo({
  variant = 'sidebar',
  side = 'left',
  collapsible = 'offcanvas',
}: DemoProps) {
  const [activeKey, setActiveKey] = useState('events')
  return (
    <SidebarProvider>
      <Sidebar variant={variant} side={side} collapsible={collapsible}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8 shrink-0 rounded-lg border">
                  <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sarah Chen</span>
                  <span className="text-muted-foreground truncate text-xs">
                    City Council, District 4
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ key, label, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={activeKey === key}
                      onClick={() => setActiveKey(key)}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <MenuIcon />
                        <span>Outreach</span>
                        <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subItems.map(({ key, label }) => (
                          <SidebarMenuSubItem key={key}>
                            <SidebarMenuSubButton
                              isActive={activeKey === key}
                              onClick={() => setActiveKey(key)}
                            >
                              {label}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UserIcon />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Dashboard</span>
        </header>
        <main className="text-muted-foreground p-6 text-sm">
          Main content area. The sidebar renders alongside it via{' '}
          <code>SidebarInset</code>.
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Playground: Story = {
  args: {
    variant: 'sidebar',
    side: 'left',
    collapsible: 'offcanvas',
  },
  render: (args) => (
    <SidebarDemo
      variant={args.variant}
      side={args.side}
      collapsible={args.collapsible}
    />
  ),
}

export const Default: Story = {
  render: () => <SidebarDemo />,
}

export const Floating: Story = {
  render: () => <SidebarDemo variant="floating" />,
}

export const Inset: Story = {
  render: () => <SidebarDemo variant="inset" />,
}

export const IconCollapsible: Story = {
  render: () => <SidebarDemo collapsible="icon" />,
}

export const RightSide: Story = {
  render: () => <SidebarDemo side="right" />,
}
