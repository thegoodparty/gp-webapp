import Label from './Label'
import IssuesForm from './IssuesForm'
import H2 from '@shared/typography/H2'
import dynamic from 'next/dynamic'
const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
})

export default function AboutStep({
  initialBio,
  initialIssues,
  issues,
  onBioChange,
  onIssuesChange,
  noHeading = false,
}) {
  return (
    <div>
      {!noHeading && <H2 className="mb-6">What is your campaign about?</H2>}
      <Label>Your Bio</Label>
      <RichEditor
        initialText={initialBio}
        onChangeCallback={(content) => {
          onBioChange(content)
        }}
        useOnChange
      />

      <IssuesForm
        issues={issues}
        onChange={onIssuesChange}
        initialIssues={initialIssues}
      />
    </div>
  )
}
