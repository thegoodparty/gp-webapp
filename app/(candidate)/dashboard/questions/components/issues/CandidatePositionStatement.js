import { TextField } from '@mui/material'

export const CandidatePositionStatement = ({
  candidatePosition = '',
  setCandidatePosition = (v) => {},
}) => (
  <TextField
    label="Your Position"
    placeholder="Write 1 or 2 sentences about your position on this issue…"
    fullWidth
    multiline
    rows={3}
    InputLabelProps={{
      shrink: true,
    }}
    value={candidatePosition}
    onChange={(e) => {
      setCandidatePosition(e.target.value)
    }}
  />
)
