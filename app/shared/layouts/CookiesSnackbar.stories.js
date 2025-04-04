import CookiesSnackbar from './CookiesSnackbar'

export default {
  title: 'Layouts/CookiesSnackbar',
  component: CookiesSnackbar,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <>
      (Clear your <strong>cookiesAccepted</strong> cookie if you cannot see the
      component)
      <CookiesSnackbar />
    </>
  ),
}

export const Default = {}
