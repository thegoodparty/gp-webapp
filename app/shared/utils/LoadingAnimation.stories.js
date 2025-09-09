import LoadingAnimationModal from 'app/shared/utils/LoadingAnimationModal'

export default {
  title: 'Utils/LoadingAnimation',
  component: LoadingAnimationModal,
  tags: ['autodocs'],
  args: {},
}

export const Default = {}
export const CustomText = {
  args: {
    label: 'Custom text underneath here',
    title: 'Custom Title',
  },
}
