'use client';
import TextField from '@shared/inputs/TextField';
import { MdSend } from 'react-icons/md';
import { useState } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';
import { Fab } from '@mui/material';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

export default function ChatInput() {
  const { handleNewInput, loading, scrollUp } = useChat();
  const [text, setText] = useState('');

  const onSubmit = async (e) => {
    if (loading) {
      return;
    }
    trackEvent(EVENTS.AIAssistant.AskQuestion, { text });
    e.preventDefault();
    setText('');
    await handleNewInput(text);
  };

  return (
    <div className="w-full max-w-[960px] px-4 pb-6 self-center relative">
      <div className="absolute bottom-[10px] pb-6 left-6 min-[1400px]:left-[-40px]">
        <Fab onClick={scrollUp} size="small" color="primary">
          <MdKeyboardArrowUp className="text-primary" />
        </Fab>
      </div>
      <form noValidate onSubmit={onSubmit}>
        <TextField
          placeholder="Ask me anything about your campaign..."
          fullWidth
          className="rounded-full bg-white pl-6 min-[1400px]:pl-0"
          value={text}
          disabled={loading}
          onChange={(e) => {
            setText(e.target.value);
          }}
          InputProps={{
            endAdornment: loading ? <GiSandsOfTime size={20} /> : <MdSend />,
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
          disabled={loading}
          type="submit"
          className="w-12 h-12 absolute right-8 top-1 opacity-0"
        />
      </form>
    </div>
  );
}
