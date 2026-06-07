import ProUpgradeStepPlaceholder from '../components/ProUpgradeStepPlaceholder'

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return (
    <ProUpgradeStepPlaceholder
      title="Upgrade to GoodParty.org Pro"
      taskNote="Value-prop / paywall — ships in task 06"
    />
  )
}
