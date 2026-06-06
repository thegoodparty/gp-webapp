import ProUpgradeStepPlaceholder from '../components/ProUpgradeStepPlaceholder'

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return (
    <ProUpgradeStepPlaceholder
      title="Complete your upgrade"
      taskNote="Payment step (embedded) — ships in task 13"
    />
  )
}
