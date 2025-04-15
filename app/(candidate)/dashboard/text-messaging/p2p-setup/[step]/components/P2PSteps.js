'use client'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

const steps = ['EIN', 'Website', 'Email', 'Review']

export default function P2PSteps({ activeStep = 0 }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}
