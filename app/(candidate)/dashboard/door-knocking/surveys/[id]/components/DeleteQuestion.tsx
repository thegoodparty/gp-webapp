import { BsTrash } from 'react-icons/bs'
import { useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import AlertDialog from '@shared/utils/AlertDialog'
import { apiRoutes } from 'gpApi/routes'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'

const deleteQuestion = async (questionId: number | string) => {
  const resp = await clientFetch(
    apiRoutes.ecanvasser.surveys.questions.delete,
    {
      questionId,
    },
  )
  return resp.data
}

interface Question {
  id: number | string
}

interface DeleteQuestionProps {
  question: Question
}

export default function DeleteQuestion({ question }: DeleteQuestionProps): React.JSX.Element {
  const { id } = question
  const [_, refreshSurvey] = useEcanvasserSurvey()

  const [showAlert, setShowAlert] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteQuestion(id)
      if (typeof refreshSurvey === 'function') {
        await refreshSurvey()
      }
      setShowAlert(false)
    } catch (error) {
      console.log('Error deleting question', error)
    }
  }

  return (
    <>
      <div onClick={() => setShowAlert(true)} className="cursor-pointer">
        <BsTrash />
      </div>
      <AlertDialog
        open={showAlert}
        handleClose={() => setShowAlert(false)}
        title="Delete Question"
        description="Are you sure you want to delete this question?"
        handleProceed={handleDelete}
      />
    </>
  )
}
