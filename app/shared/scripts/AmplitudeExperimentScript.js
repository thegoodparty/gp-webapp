'use client'
import Script from 'next/script'
import { AMPLITUDE_EXPERIMENT_API_KEY } from 'appEnv'

const AmplitudeExperimentScript = () => {
  return (
    <>
      <Script
        src="https://unpkg.com/@amplitude/experiment-js-client@1.15.5/dist/experiment.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Initialize the experiment client with third-party approach
          if (typeof window !== 'undefined' && window.Experiment) {
            window.experiment = window.Experiment.initialize(
              AMPLITUDE_EXPERIMENT_API_KEY,
              {
                exposureTrackingProvider: {
                  track: (exposure) => {
                    // TODO: Implement exposure tracking
                    // This can be integrated with your existing analytics
                    console.log('Amplitude Experiment exposure:', exposure)
                  }
                }
              }
            )
          }
        }}
      />
    </>
  )
}

export default AmplitudeExperimentScript 