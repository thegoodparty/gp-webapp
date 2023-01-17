'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import { useState } from 'react';
import TextField from '@shared/inputs/TextField';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import OnboardingWrapper from '../../shared/OnboardingWrapper';

const adjustFields = [
  { key: 'tokens', label: 'Tokens' },
  { key: 'temperature', label: 'Temperature' },
];

const inputFields = [
  { key: 'name', label: 'What is your name?' },
  {
    key: 'office',
    label: 'What office are you running for (include district please)?',
    rows: 3,
  },
  {
    key: 'party',
    label: 'What party do you run for?',
  },
  { key: 'issues', label: 'What are the main issues you care about?', rows: 3 },
];

const fetchOnboardingMessage = async (prompt, tokens, temperature) => {
  try {
    const api = gpApi.campaign.onboarding.test;
    const payload = { prompt, tokens, temperature };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('e', e);
    return 'An Error occurred, please try again.';
  }
};

export default function OnboardingPage(props) {
  const [state, setState] = useState({
    tokens: 16,
    temperature: 0.7,
    name: '',
    office: '',
    issues: '',
    prompt: `Create a campaign description for a political candidate named [[name]] who is running for  [[office]]. [[name]] is a member of the [[party]] party and cares deeply about [[issues]]. The campaign description should highlight [[name]]'s qualifications, experience, and commitment to creating positive change in their community.
    
    `,
    loading: false,
    output: '',
  });

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return (
      state.name !== '' &&
      state.office !== '' &&
      state.issues !== '' &&
      state.prompt !== ''
    );
  };

  const submitForm = async () => {
    onChangeField('loading', true);
    let prompt = state.prompt;
    prompt = prompt.replace(/\[\[name\]\]/g, state.name);
    prompt = prompt.replace(/\[\[office\]\]/g, state.office);
    prompt = prompt.replace(/\[\[issues\]\]/g, state.issues);
    prompt = prompt.replace(/\[\[party\]\]/g, state.party);
    console.log('prop1', prompt);
    const { message } = await fetchOnboardingMessage(
      prompt,
      state.tokens,
      state.temperature,
    );
    console.log('messae', message);

    setState({
      ...state,
      output: message,
      loading: false,
    });
    console.log('state set');
  };
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#400c0f">
        <h3 className="font-black mb-6">Adjust AI</h3>
        {adjustFields.map((field) => (
          <div className="mb-4" key={field.key}>
            <TextField
              label={field.label}
              fullWidth
              value={state[field.key]}
              onChange={(e) => onChangeField(field.key, e.target.value)}
            />
          </div>
        ))}
        <div className="p-3">
          <a
            href="https://beta.openai.com/docs/api-reference/completions/create#completions/create-model"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            all options
          </a>
        </div>
      </PortalPanel>
      <PortalPanel color="#ea580c">
        <h3 className="font-black mb-6">Input Data</h3>
        {inputFields.map((field) => (
          <div className="mb-4" key={field.key}>
            <TextField
              label={field.label}
              fullWidth
              value={state[field.key]}
              onChange={(e) => onChangeField(field.key, e.target.value)}
              multiline={!!field.rows}
              rows={field.rows || 1}
            />
          </div>
        ))}
      </PortalPanel>

      <PortalPanel color="#b91c1c">
        <h3 className="font-black mb-6">AI Prompt</h3>
        <TextField
          label="Prompt"
          fullWidth
          value={state.prompt}
          onChange={(e) => onChangeField('prompt', e.target.value)}
          multiline
          rows={4}
        />
        <br />
        <br />
        <br />
        <BlackButtonClient
          onClick={submitForm}
          disabled={!canSubmit()}
          className="w-full font-bold text-lg"
        >
          SEND
        </BlackButtonClient>
      </PortalPanel>

      <PortalPanel color="#4d7c0f">
        <h3 className="font-black mb-6">Output</h3>
        {state.loading ? (
          <LoadingAnimation fullPage={false} />
        ) : (
          <div>{state.output}</div>
        )}
      </PortalPanel>
    </OnboardingWrapper>
  );
}
