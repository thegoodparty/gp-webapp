import TextField from '@shared/inputs/TextField';
import { MdSend } from 'react-icons/md';
import { ChatContext } from './CampaignManagerPage';
import { useContext } from 'react';

export default function ChatInput() {
  const { handleNewInput } = useContext(ChatContext);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <div className="fixed bottom-0 right-2 w-full lg:w-[calc(100vw-256px-32px)]  px-4">
      <div className="w-full lg:w-[900px] mx-auto pb-6 bg-indigo-100 relative px-4 lg:px-8">
        <form noValidate onSubmit={onSubmit}>
          <TextField
            placeholder="Ask me anything about your campaign..."
            fullWidth
            className="rounded-full bg-white"
            InputProps={{
              endAdornment: <MdSend />,
              style: {
                outline: 'none',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '50%',
                paddingLeft: '16px',
                borderColor: 'transparent',
                '& fieldset': {
                  borderColor: 'transparent',
                  border: 'none',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused': {
                  outline: 'none',
                },
              },
            }}
            inputProps={{
              style: {
                outline: 'none', // Remove browser's default focus outline
              },
            }}
          />
          <button
            type="submit"
            className="w-12 h-12 absolute right-1 top-1 opacity-0"
          />
        </form>
      </div>
    </div>
  );
}
