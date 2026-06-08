import ProUpgradeWizard from './components/ProUpgradeWizard'

export const dynamic = 'force-dynamic'

export default function ProUpgradeLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return <ProUpgradeWizard>{children}</ProUpgradeWizard>
}
