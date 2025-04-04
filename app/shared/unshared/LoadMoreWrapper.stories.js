import LoadMoreWrapper from 'app/blog/shared/LoadMoreWrapper'

export default {
  title: 'Unshared/LoadMoreWrapper',
  component: LoadMoreWrapper,
  tags: ['autodocs'],
  render: (args) => {
    return (
      <>
        <strong>(Used in blog list pages)</strong>
        <p>
          Ullamco deserunt et ea velit fugiat commodo aute cupidatat culpa duis
          dolor in. Magna reprehenderit ipsum deserunt ipsum ex nostrud deserunt
          Lorem mollit sunt aliqua in. Ipsum fugiat officia do dolor non
          deserunt ullamco do non non aliqua cillum. Nostrud cupidatat anim ad
          veniam cillum. Adipisicing elit non irure fugiat Lorem eiusmod esse
          Lorem magna exercitation. Aliquip magna magna do ipsum. Consequat
          aliqua aute magna consequat Lorem id mollit amet. Sunt adipisicing
          adipisicing eiusmod elit proident id aute officia in consequat ad.
        </p>
        <LoadMoreWrapper {...args}>
          <p>
            Occaecat ex nisi mollit qui consequat esse aliqua non minim.
            Exercitation culpa aliquip duis mollit consequat. Aute sunt laborum
            do excepteur mollit ex proident id fugiat elit ut. Ea adipisicing
            officia exercitation qui officia sit culpa commodo nostrud Lorem
            aliqua ex fugiat aliqua. Et dolore quis nostrud do excepteur et
            cupidatat commodo officia. Duis laboris consequat voluptate non anim
            exercitation aute quis fugiat. Anim nulla officia anim magna id
            velit tempor laboris amet tempor consequat sint veniam ad. Enim
            exercitation veniam nostrud consectetur qui dolore quis irure ad
            aliquip irure velit. Sunt laborum ullamco aliquip eiusmod. Qui
            mollit ipsum non magna proident ut ullamco quis et.
          </p>
        </LoadMoreWrapper>
      </>
    )
  },
}

export const Default = {}
