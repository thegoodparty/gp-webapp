import { Button, Card } from '@styleguide'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export default function TestingRegenerate({
  tasksNumber,
}: {
  tasksNumber: number
}) {
  if (tasksNumber === 0) {
    return null
  }

  const handleDeleteAllTasks = async () => {
    await clientFetch(apiRoutes.campaign.tasks.deleteAll)
    //refresh the page
    window.location.reload()
  }
  return (
    <Card className="bg-red-200 p-4">
      <div className="text-lg font-bold">For testing purposes only</div>
      <div>
        <Button
          variant="default"
          color="primary"
          onClick={handleDeleteAllTasks}
        >
          Delete and Regenerate
        </Button>
      </div>
    </Card>
  )
}
