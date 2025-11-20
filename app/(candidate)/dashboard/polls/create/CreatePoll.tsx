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
import clsx from 'clsx'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useQuery } from '@tanstack/react-query'
import { LuLoaderCircle } from 'react-icons/lu'
import { formatCurrency, numberFormatter } from 'helpers/numberHelper'
import { calculateRecommendedPollSize } from '../shared/audience-selection'
import { orderBy } from 'es-toolkit'

const TEXT_PRICE = 0.035

type Details = {
  title: string
  introduction: string
  question: string
}

type State =
  | {
      step: 'details'
      details?: Details
    }
  | {
      step: 'audience-selection'
      details: Details
      targetAudienceSize?: number
    }
  | {
      step: 'date-selection'
      details: Details
      targetAudienceSize: number
      scheduledDate?: string
    }
  | {
      step: 'add-image'
      details: Details
      targetAudienceSize: number
      scheduledDate: string
      imageUrl?: string
    }
  | {
      step: 'review'
      details: Details
      targetAudienceSize: number
      scheduledDate: string
      imageUrl: string
      pollId: string
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
          <div className="md:block w-full border-t border-slate-200 pt-8 px-8 lg:px-16">
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

const DetailsForm: React.FC<{
  details?: Details
  onChange: (details: Details) => void
}> = ({ details, onChange }) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Details>({
    defaultValues: details ?? {
      title: '',
      introduction: '',
      question: '',
    },
  })

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
              value: 5,
              message: 'Title must be at least 5 characters',
            },
          })}
          className={errors.title ? 'border-red-500' : ''}
          id="title"
          placeholder="What would you like to name your poll? "
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
        <label className="block mb-2 mt-4">Poll Introduction</label>
        <Controller
          name="introduction"
          control={control}
          rules={{ required: 'Introduction is required' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={clsx(
                  'w-full',
                  errors.introduction ? 'border-red-500' : '',
                )}
              >
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
          className={errors.question ? 'border-red-500' : ''}
          placeholder="What local issues matter most to you? I'd genuinely value your input. Reply to share."
          rows={6}
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-500">{errors.question.message}</p>
        )}
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

const AudienceSelectionForm: React.FC<{
  goBack: () => void
  onChange: (targetAudienceSize: number) => void
}> = ({ goBack, onChange }) => {
  const [selectedAudienceSize, setSelectedAudienceSize] = useState<
    number | undefined
  >(undefined)

  const query = useQuery({
    queryKey: ['total-constituents'],
    queryFn: () =>
      clientFetch<{ meta: { totalConstituents: number } }>(
        apiRoutes.contacts.stats,
      ).then((res) => ({ totalConstituents: res.data.meta.totalConstituents })),
  })

  if (query.status !== 'success') {
    return (
      <FormStep step="details" onBack={goBack} nextButton={<></>}>
        <LuLoaderCircle
          className="animate-spin text-blue-500 mx-auto"
          size={60}
        />
      </FormStep>
    )
  }

  const { recommendedSendCount } = calculateRecommendedPollSize({
    alreadySent: 0,
    expectedResponseRate: 0.03,
    responsesAlreadyReceived: 0,
    totalConstituents: query.data.totalConstituents,
  })

  const recommendedMessage =
    'The smallest group for statistically reliable results.'

  let options = [
    { pct: 0.25, message: 'Low impact.' },
    { pct: 0.5, message: 'Medium impact.' },
    { pct: 0.75, message: 'High impact.' },
    { pct: 1, message: "You can't do any better than this!" },
  ].map(({ pct, message }) => {
    const count = Math.ceil(query.data.totalConstituents * pct)
    const isRecommended = count === recommendedSendCount
    return {
      count,
      percentage: `${pct * 100}%`,
      isRecommended: count === recommendedSendCount,
      message: isRecommended ? recommendedMessage : message,
    }
  })

  if (!options.some((option) => option.isRecommended)) {
    options = orderBy(
      [
        ...options,
        {
          count: recommendedSendCount,
          percentage: `${Math.round(
            (recommendedSendCount / query.data.totalConstituents) * 100,
          )}%`,
          isRecommended: true,
          message: recommendedMessage,
        },
      ],
      [(o) => o.count],
      ['asc'],
    )
  }

  return (
    <FormStep
      step="audience-selection"
      onBack={goBack}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          disabled={!selectedAudienceSize}
          onClick={() => {
            if (!selectedAudienceSize) {
              return
            }

            onChange(selectedAudienceSize)
          }}
        >
          Select Audience
        </Button>
      }
    >
      <H1 className="md:text-center">
        How many constituents do you want to message?
      </H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        There are {numberFormatter(query.data.totalConstituents)} constituents
        with cell phone numbers in your community.
      </p>

      <div className="w-full flex flex-col gap-2">
        {options.map((option) => (
          <div
            key={`audience-option-${option.count}`}
            className={clsx(
              // hover
              'flex items-center justify-between flex-row border-2 rounded-lg p-4 gap-4 hover:border-blue-400 cursor-pointer',
              // thicker blue border when selected
              selectedAudienceSize === option.count
                ? 'border-blue-500'
                : 'border-slate-200',
            )}
            onClick={() => setSelectedAudienceSize(option.count)}
          >
            <div className="flex-1">
              <p>
                {numberFormatter(option.count)} constituents (
                {option.percentage})
              </p>
              <p className="text-sm text-muted-foreground">{option.message}</p>
            </div>
            {option.isRecommended && (
              <span className="ml-8 inline-flex items-center px-2 py-0.5 rounded bg-blue-500 text-white">
                Recommended
              </span>
            )}
            <p>${formatCurrency(TEXT_PRICE * option.count)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground text-center">
          Each message costs ${TEXT_PRICE}.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          You can only send to 10,000 constituents at a time.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Once your poll results are in, you can expand your poll to send to
          more people.
        </p>
      </div>
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
          details={state.details}
          onChange={(details) =>
            setState({ step: 'audience-selection', details })
          }
        />
      )}

      {state.step === 'audience-selection' && (
        <AudienceSelectionForm
          goBack={() => setState({ step: 'details', details: state.details })}
          onChange={(targetAudienceSize) =>
            setState({
              step: 'date-selection',
              details: state.details,
              targetAudienceSize,
            })
          }
        />
      )}

      {/* TODO: fill out remaining steps */}
    </DashboardLayout>
  )
}
