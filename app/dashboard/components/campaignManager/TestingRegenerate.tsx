import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
} from '@styleguide'
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
    window.location.reload()
  }

  return (
    <Card className="border-destructive  p-4">
      <div className="text-lg font-bold">For testing purposes only</div>
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Delete and Regenerate all tasks
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all tasks and regenerate them. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteAllTasks}
              >
                Delete All Tasks
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}
