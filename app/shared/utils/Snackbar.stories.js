import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import Snackbar from './Snackbar'

export default {
  title: 'Utils/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  args: {},
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { successSnackbar, errorSnackbar } = useSnackbar()

    const show = (type) => {
      if (type === 'success') {
        successSnackbar('You have done something successfully.')
      } else if (type === 'error') {
        errorSnackbar('An error has occured.')
      } else {
      }
    }

    return (
      <>
        <Snackbar />
        <div className="flex gap-3">
          <Button color="success" onClick={() => show('success')}>
            Show Success Snackbar
          </Button>
          <Button color="error" onClick={() => show('error')}>
            Show Error Snackbar
          </Button>
        </div>
      </>
    )
  },
}

export const Default = {}
