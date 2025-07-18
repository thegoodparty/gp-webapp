import Button from '@shared/buttons/Button'
import H2 from '@shared/typography/H2'

export default function GreatSuccess() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] w-full justify-center items-center">
      <H2 className="mb-8">great success</H2>
      <Button color="primary" variant="contained" href="/dashboard/website">
        Go to website
      </Button>
    </div>
  )
}
