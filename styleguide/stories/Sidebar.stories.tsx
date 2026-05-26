import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import {
  CalendarIcon,
  CircleUserRoundIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SendIcon,
  SettingsIcon,
  UserCogIcon,
} from '../components/ui/icons'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
        'offcanvas slides the sidebar out; icon keeps a narrow rail; none disables collapse.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'These stories document the generic Sidebar primitive. The GoodParty dashboard sidebar (`app/dashboard/shared/DashboardMenu.tsx`) composes this primitive with auth, campaign, and feature-flag providers — it is not rendered here. Use this page to understand the Sidebar API; verify production-fidelity by running the dev server.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { key: 'inbox', label: 'Inbox', icon: SendIcon },
  { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { key: 'documents', label: 'Documents', icon: FileTextIcon },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
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
  const [activeKey, setActiveKey] = useState('dashboard')
  return (
    <SidebarProvider>
      <Sidebar variant={variant} side={side} collapsible={collapsible}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-bold">
                  AC
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Corp</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Workspace
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(({ key, label, icon: Icon }) => (
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent h-auto gap-2 p-2">
                    <Avatar className="size-8 shrink-0 rounded-lg border">
                      <AvatarFallback className="rounded-lg">U</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left leading-none">
                      <span className="truncate text-sm font-semibold">
                        User Name
                      </span>
                      <span className="truncate text-xs">user@example.com</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <CircleUserRoundIcon className="size-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCogIcon className="size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOutIcon className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="text-muted-foreground p-6 text-sm">
          Page content. The sidebar renders alongside it via{' '}
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
