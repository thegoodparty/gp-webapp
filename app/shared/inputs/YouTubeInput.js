'use client'

import React, { useState, useEffect } from 'react'
import TextField from '@shared/inputs/TextField'
import { youtubeParser } from 'helpers/videoHelper'

const YouTubeInput = ({ onChangeCallback, initialId }) => {
  const [state, setState] = useState({
    url: '',
    youtubeId: false,
  })
  useEffect(() => {
    if (initialId) {
      const url = `https://www.youtube.com/watch?v=${initialId}`
      const id = youtubeParser(url)
      setState({
        url,
        youtubeId: id,
      })
    }
  }, [initialId])

  const onChangeField = (value) => {
    const id = youtubeParser(value)

    setState({
      url: value,
      youtubeId: id,
    })
    onChangeCallback(value, id)
  }

  const isValid = state.url === '' || state.youtubeId
  return (
    <TextField
      name="YouTube URL"
      variant="outlined"
      label="YouTube URL"
      value={state.url}
      fullWidth
      error={!isValid}
      helperText={isValid ? '' : 'Please enter a valid youtube url'}
      onChange={(e) => {
        onChangeField(e.target.value)
      }}
    />
  )
}
export default YouTubeInput
