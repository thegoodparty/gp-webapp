import ImageUpload from './ImageUpload'

export default {
  title: 'Utils/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  args: {},
}

export const Default = {}
export const CustomElement = {
  args: {
    customElement: (
      <div
        className={`text-lg py-3 px-6 rounded-lg font-medium bg-primary-dark text-slate-50 inline-block bg-primary-dark`}
      >
        {'Upload Image'}
      </div>
    ),
  },
}
