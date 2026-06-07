import ProUpgradeStepPlaceholder from '../components/ProUpgradeStepPlaceholder'

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return (
    <ProUpgradeStepPlaceholder
      title="Your EIN"
      taskNote="EIN step — ships in task 10"
    />
  )
}
