import Button from '@shared/buttons/Button';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import Modal from '@shared/utils/Modal';
import { useContext, useState } from 'react';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io';
import { chatFeedback } from './ajaxActions';
import { ChatContext } from './CampaignManagerPage';

export default function ChatFeedback() {
  const { feedback: dbFeedback, threadId } = useContext(ChatContext);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState(dbFeedback?.type);

  const handleSubmitNegative = async () => {
    await chatFeedback(threadId, 'negative', feedback);
    setShowModal(false);
  };

  const handleSubmitPositive = async () => {
    setType('positive');
    await chatFeedback(threadId, 'positive');
  };

  return (
    <div className="flex items-center">
      <div
        className={`mr-3 cursor-pointer rounded-full hover:bg-indigo-700 hover:bg-opacity-10 p-2 ${
          type === 'positive' ? 'bg-indigo-700 bg-opacity-10' : ''
        }`}
        onClick={handleSubmitPositive}
      >
        <IoMdThumbsUp className="" size={18} />
      </div>
      <div
        className={`mr-3 cursor-pointer rounded-full hover:bg-indigo-700 hover:bg-opacity-10 p-2 ${
          type === 'negative' ? 'bg-indigo-700 bg-opacity-10' : ''
        }`}
        onClick={() => {
          setShowModal(true);
          setType('negative');
        }}
      >
        <IoMdThumbsDown size={18} className=" cursor-pointer" />
      </div>
      <Modal
        title="Feedback"
        open={showModal}
        closeCallback={() => setShowModal(false)}
      >
        <div className="w-[80vw] max-w-lg p-2">
          <H1 className="text-center mb-4">How can we improve?</H1>
          <Body1 className="mb-4">
            Please tell us what was wrong and how it could have been improved.
          </Body1>
          <TextField
            label="Add Feedback"
            placeholder="Type your feedback here..."
            multiline
            fullWidth
            required
            rows={6}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex justify-between mt-8">
            <Button color="neutral" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={feedback === ''}
              onClick={handleSubmitNegative}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
