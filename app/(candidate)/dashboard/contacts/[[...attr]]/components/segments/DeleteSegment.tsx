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
} from 'goodparty-styleguide'
import { deleteCustomSegment } from '../shared/ajaxActions'
import { useCustomSegments } from '../../hooks/CustomSegmentsProvider'
import { useState } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { type SegmentResponse } from '../shared/ajaxActions'

interface DeleteSegmentProps {
  segment: SegmentResponse
  afterDeleteCallback: () => void
}

export default function DeleteSegment({
  segment,
  afterDeleteCallback,
}: DeleteSegmentProps) {
  const { id } = segment
  const [, , refreshCustomSegments] = useCustomSegments()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true)
      await deleteCustomSegment(id)
      refreshCustomSegments()
      afterDeleteCallback()
      trackEvent(EVENTS.Contacts.SegmentDeleted)
    } catch (error) {
      console.log('Error deleting segment', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="mt-12"
          loading={isDeleting}
          disabled={isDeleting}
        >
          Delete Segment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[2000]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="font-normal">
              Are you sure you want to delete your custom segment
            </span>{' '}
            {segment.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete Segment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
