import ProUpgradeStepPlaceholder from '../components/ProUpgradeStepPlaceholder'

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return (
    <ProUpgradeStepPlaceholder
      title="Your texting compliance status"
      taskNote="Filing-status branch — ships in task 07"
    />
  )
}
