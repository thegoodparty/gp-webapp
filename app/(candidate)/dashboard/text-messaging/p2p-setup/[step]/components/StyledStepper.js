'use client'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

export default function StyledStepper({ activeStep = 0, stepLabels = [] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepLabels.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}
