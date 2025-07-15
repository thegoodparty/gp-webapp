# Amplitude Experiment SDK Setup

This document describes how to use the Amplitude Experiment SDK in the GoodParty application.

## Overview

The Amplitude Experiment SDK has been integrated using the third-party approach. The SDK is loaded globally and can be used throughout the application to run A/B tests and feature flags.

## Files Added

1. **`app/shared/scripts/AmplitudeExperimentScript.js`** - Script component that loads the SDK
2. **`app/shared/hooks/useAmplitudeExperiment.js`** - Custom hook for accessing the experiment client
3. **`app/layout.js`** - Updated to include the experiment script globally

## Environment Configuration

The SDK is configured with the API key from the environment variable `NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_API_KEY`. If not set, it defaults to the development key.

To set the environment variable:

```bash
# Local development
NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_API_KEY=your_api_key_here

# Vercel deployment
# Add NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_API_KEY to your Vercel environment variables
```

## Usage

### Basic Usage in a Component

```javascript
import useAmplitudeExperiment from '@shared/hooks/useAmplitudeExperiment'
import { useUser } from '@shared/hooks/useUser'

const MyComponent = () => {
  const { isReady, fetch, evaluate } = useAmplitudeExperiment()
  const [user] = useUser()

  useEffect(() => {
    if (isReady && user) {
      // Fetch experiment flags for the current user
      fetch({
        user_id: user.id,
        device_id: user.deviceId,
        user_properties: {
          email: user.email,
          name: user.name,
          // Add any other user properties you want to use for targeting
        }
      })
    }
  }, [isReady, user, fetch])

  // Evaluate a specific flag
  const flagValue = evaluate('my-experiment-flag', {
    user_id: user?.id,
    device_id: user?.deviceId,
    user_properties: {
      email: user?.email,
      name: user?.name,
    }
  })

  return (
    <div>
      {flagValue?.value && (
        <div>This feature is enabled for this user!</div>
      )}
    </div>
  )
}
```

### Available Methods

The `useAmplitudeExperiment` hook provides the following methods:

- **`isReady`** - Boolean indicating if the experiment client is ready
- **`experiment`** - The raw experiment client instance
- **`fetch(user)`** - Fetch experiment flags for a user
- **`evaluate(flagKey, user)`** - Evaluate a specific flag for a user
- **`evaluateAll(user)`** - Evaluate all flags for a user

### User Object Structure

When calling `fetch` or `evaluate`, provide a user object with:

```javascript
{
  user_id: "user123",
  device_id: "device456", // Optional
  user_properties: {
    email: "user@example.com",
    name: "John Doe",
    // Add any other properties for targeting
  }
}
```

### Example: Feature Flag

```javascript
const showNewFeature = evaluate('show-new-feature', user)
if (showNewFeature?.value) {
  // Show the new feature
  return <NewFeatureComponent />
} else {
  // Show the old feature
  return <OldFeatureComponent />
}
```

### Example: A/B Test

```javascript
const variant = evaluate('button-color-test', user)
const buttonColor = variant?.value || 'blue' // Default to blue

return (
  <button style={{ backgroundColor: buttonColor }}>
    Click me
  </button>
)
```

## Integration with Analytics

The experiment client is configured with an exposure tracking provider that logs exposures to the console. You can integrate this with your existing analytics system by modifying the `AmplitudeExperimentScript.js` file.

## Testing

To test the integration:

1. Create an experiment in Amplitude Experiment
2. Check the browser console for experiment evaluations
3. Verify that the correct variants are being served

## Troubleshooting

- **Client not ready**: The hook will retry automatically until the client is loaded
- **No user data**: Make sure the user object is available before calling fetch/evaluate
- **Flag not found**: Check that the flag key matches exactly what's configured in Amplitude
- **API key issues**: Verify that `NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_API_KEY` is set correctly

## Resources

- [Amplitude Experiment JavaScript SDK Documentation](https://amplitude.com/docs/sdks/experiment-sdks/experiment-javascript)
- [Amplitude Experiment Console](https://experiment.amplitude.com/) 