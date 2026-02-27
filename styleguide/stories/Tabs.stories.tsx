import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Account Settings</h4>
          <p className="text-sm text-muted-foreground">
            Make changes to your account settings and set your preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Password Settings</h4>
          <p className="text-sm text-muted-foreground">
            Change your password and manage your security settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const WithMultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Overview</h4>
          <p className="text-sm text-muted-foreground">
            Get a quick overview of your account and recent activity.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Analytics</h4>
          <p className="text-sm text-muted-foreground">
            View detailed analytics and performance metrics.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Reports</h4>
          <p className="text-sm text-muted-foreground">
            Access and download your reports.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Active Tab</h4>
          <p className="text-sm text-muted-foreground">
            This tab is active and can be interacted with.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="disabled">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Disabled Tab</h4>
          <p className="text-sm text-muted-foreground">
            This tab is disabled and cannot be accessed.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
