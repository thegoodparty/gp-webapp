import { BsTrash } from 'react-icons/bs'
import { useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import AlertDialog from '@shared/utils/AlertDialog'
import { apiRoutes } from 'gpApi/routes'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'
const deleteQuestion = async (questionId) => {
  const resp = await clientFetch(
    apiRoutes.ecanvasser.surveys.questions.delete,
    {
      questionId,
    },
  )
  return resp.data
}

export default function DeleteQuestion({ question }) {
  const { id } = question
  const [_, refreshSurvey] = useEcanvasserSurvey()

  const [showAlert, setShowAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteQuestion(id)
      refreshSurvey()
      setShowAlert(false)
    } catch (error) {
      console.log('Error deleting question', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <BsTrash
        className="cursor-pointer text-red-500 hover:text-red-700"
        onClick={() => setShowAlert(true)}
      />

      <AlertDialog
        open={showAlert}
        handleClose={() => setShowAlert(false)}
        redButton={true}
        title="Delete Question"
        description={`Are you sure you want to delete "${question.name}"?`}
        handleProceed={handleDelete}
        proceedLabel="Delete"
        loading={isDeleting}
      />
    </>
  )
}
