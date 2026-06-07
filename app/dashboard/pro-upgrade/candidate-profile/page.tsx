import ProUpgradeStepPlaceholder from '../components/ProUpgradeStepPlaceholder'

export const dynamic = 'force-dynamic'

export default function Page(): React.JSX.Element {
  return (
    <ProUpgradeStepPlaceholder
      title="Your candidate profile"
      taskNote="Candidate-profile step — ships in task 12"
    />
  )
}
