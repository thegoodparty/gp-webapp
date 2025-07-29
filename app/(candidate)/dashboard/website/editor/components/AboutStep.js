import Label from './Label'
import TextField from '@shared/inputs/TextField'
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
  bio,
  issues,
  committee,
  onBioChange,
  onIssuesChange,
  onCommitteeChange,
  noHeading = false,
}) {
  return (
    <div>
      {!noHeading && <H2 className="mb-6">What is your campaign about?</H2>}
      <Label>Your Bio</Label>
      <RichEditor
        initialText={bio}
        onChangeCallback={(content) => {
          onBioChange(content)
        }}
        useOnChange
      />
      {/* <TextField
        fullWidth
        required
        multiline
        rows={4}
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      /> */}

      <Label className="mt-4">Committee</Label>
      <TextField
        fullWidth
        required
        value={committee}
        onChange={(e) => onCommitteeChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <IssuesForm issues={issues} onChange={onIssuesChange} />
    </div>
  )
}
