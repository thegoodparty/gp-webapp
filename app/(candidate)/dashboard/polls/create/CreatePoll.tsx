'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import DashboardLayout from '../../shared/DashboardLayout'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { StepIndicator } from '@shared/stepper'
import { useRouter } from 'next/navigation'
import H1 from '@shared/typography/H1'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'goodparty-styleguide'
import PollTextBiasInput from '../shared/components/poll-text-bias/PollTextBiasInput'

type Details = {
  title: string
  introduction: string
  question: string
}

type State =
  | {
      step: 'details'
    }
  | {
      step: 'audience-selection'
      details: Details
    }
  | {
      step: 'date-selection'
      details: Details
      targetAudienceSize: number
    }
  | {
      step: 'add-image'
      details: Details
      targetAudienceSize: number
      scheduledDate: string
    }
  | {
      step: 'review'
      details: Details
      targetAudienceSize: number
      scheduledDate: string
      imageUrl: string
    }
  | {
      step: 'payment'
      details: Details
      targetAudienceSize: number
      scheduledDate: string
      imageUrl: string
    }
  | {
      step: 'payment-confirmed'
      pollId: string
    }

const order: Array<State['step']> = [
  'details',
  'audience-selection',
  'date-selection',
  'add-image',
  'review',
  'payment',
  'payment-confirmed',
]

const FormStep: React.FC<{
  step: State['step']
  onBack: () => void
  nextButton: React.ReactNode
  children: React.ReactNode
}> = ({ step, onBack, nextButton, children }) => {
  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-140 md:pb-0">
        <section className="max-w-screen-md mx-auto bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12 xs:pt-4 md:mb-16">
          <div className="p-4 sm:p-8 lg:p-16 lg:pb-4">{children}</div>
          <div className="hidden md:block w-full border-t border-slate-200 pt-8 px-8 lg:px-16">
            <StepIndicator
              numberOfSteps={order.length}
              currentStep={order.indexOf(step) + 1}
            />
            <div className="flex justify-between py-6">
              <Button variant="ghost" onClick={onBack}>
                {order.indexOf(step) === 0 ? 'Exit' : 'Back'}
              </Button>
              {nextButton}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const DetailsForm: React.FC<{ onChange: (details: Details) => void }> = ({
  onChange,
}) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Details>({
    defaultValues: {
      title: '',
      introduction: '',
      question: '',
    },
  })

  const [questionValue, setQuestionValue] = useState('')

  const onSubmit = async (data: Details) => {
    // TODO: perform async validation using LLM endpoint
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If validation passes, call onChange
    onChange(data)
  }

  return (
    <FormStep
      step="details"
      onBack={() => router.push('/dashboard/polls')}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Select Audience
        </Button>
      }
    >
      <H1 className="md:text-center">First, let&apos;s build your poll.</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        You can preview your poll at the end of this workflow.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">Poll Name</label>
        <Input
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
          })}
          id="title"
          placeholder="What would you like to name your poll? "
        />
        <label className="block mb-2 mt-4">Poll Introduction</label>
        <Controller
          name="introduction"
          control={control}
          rules={{ required: 'Introduction is required' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your introduction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.introduction && (
          <p className="mt-1 text-sm text-red-500">
            {errors.introduction.message}
          </p>
        )}

        <label className="block mb-2 mt-4">Poll Question</label>
        <Textarea
          {...register('question', {
            required: 'Question is required',
            minLength: {
              value: 25,
              message: 'Question must be at least 25 characters',
            },
          })}
          placeholder="What local issues matter most to you? I'd genuinely value your input. Reply to share."
          rows={6}
        />
        <PollTextBiasInput
          value={questionValue}
          onChange={setQuestionValue}
          placeholder="What local issues matter most to you? I'd genuinely value your input. Reply to share."
        />
        <p className="mt-1.5 text-sm text-muted-foreground">
          We recommend checking your message for clarity and bias using optimize
          message.
        </p>

        <label className="block mb-2 mt-4">Poll Closing</label>
        <Input
          className="bg-muted color-muted-foreground"
          value="Text STOP to opt out"
          disabled
        />
      </form>
    </FormStep>
  )
}

export const CreatePoll: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [campaign] = useCampaign()

  const [state, setState] = useState<State>({
    step: 'details',
  })

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      {state.step === 'details' && (
        <DetailsForm
          onChange={(details) =>
            setState({ step: 'audience-selection', details })
          }
        />
      )}

      {/* TODO: fill out remaining steps */}

      {state.step !== 'details' && (
        <div>This will be an awesome poll creation experience!</div>
      )}
    </DashboardLayout>
  )
}
