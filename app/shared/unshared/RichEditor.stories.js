import RichEditor from 'app/(candidate)/dashboard/plan/components/RichEditor';

export default {
  title: 'Unshared/RichEditor',
  component: RichEditor,
  tags: ['autodocs'],
  args: {
    initialText: 'Some initial text to edit here',
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3 items-start">
        <strong>(Used in dashboard / campaign plan )</strong>
        <RichEditor {...args} />
      </div>
    );
  },
};

export const Default = {};
