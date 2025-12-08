'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import DashboardLayout from '../../shared/DashboardLayout'
import { useState, useEffect, useRef } from 'react'
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
} from 'goodparty-styleguide'
import PollTextBiasInput, {
  BiasAnalysisState,
} from '../shared/components/poll-text-bias/PollTextBiasInput'
import clsx from 'clsx'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useQuery } from '@tanstack/react-query'
import { LuLoaderCircle } from 'react-icons/lu'
import { formatCurrency, numberFormatter } from 'helpers/numberHelper'
import { calculateRecommendedPollSize } from '../shared/audience-selection'
import { orderBy } from 'es-toolkit'
import DateInputCalendar from '@shared/inputs/DateInputCalendar'
import { addDays, startOfDay } from 'date-fns'
import { PollImageUpload } from '../components/PollImageUpload'
import { grammarizeOfficeName } from 'app/polls/onboarding/utils/grammarizeOfficeName'
import { useUser } from '@shared/hooks/useUser'
import { MessageCard } from 'app/polls/onboarding/components/MessageCard'
import TextMessagePreview from '@shared/text-message-previews/TextMessagePreview'
import Image from 'next/image'
import { PRICE_PER_POLL_TEXT } from '../shared/constants'

const MIN_QUESTION_LENGTH = 25

type Details = {
  title: string
  introduction: string
  question: string
}

enum Step {
  details,
  audienceSelection,
  dateSelection,
  addImage,
  review,
  payment,
  paymentConfirmed,
}

type State =
  | {
      step: Step.details
      details?: Details
    }
  | {
      step: Step.audienceSelection
      details: Details
      targetAudienceSize?: number
    }
  | {
      step: Step.dateSelection
      details: Details
      targetAudienceSize: number
      scheduledDate?: Date
    }
  | {
      step: Step.addImage
      details: Details
      targetAudienceSize: number
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.review
      details: Details
      targetAudienceSize: number
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.payment
      details: Details
      targetAudienceSize: number
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.paymentConfirmed
      pollId: string
    }

const order: Array<Step> = [
  Step.details,
  Step.audienceSelection,
  Step.dateSelection,
  Step.addImage,
  Step.review,
  Step.payment,
  Step.paymentConfirmed,
]

const FormStep: React.FC<{
  step: Step
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

const introOptions = (params: {
  eoName: string
  city: string
  office: string
}) => [
  `Hi [Name]. I’m ${params.eoName}, your ${params.city} ${params.office}.`,
  `Hello [Name], I am your ${params.city} ${params.office}, ${params.eoName}.`,
  `${params.city} ${params.office} ${params.eoName} wants to hear from you, [Name].`,
  `${params.city} ${params.office} ${params.eoName} needs your input, [Name].`,
]

const DetailsForm: React.FC<{
  details?: Details
  onChange: (details: Details) => void
}> = ({ details, onChange }) => {
  const router = useRouter()
  const [biasAnalysisState, setBiasAnalysisState] =
    useState<BiasAnalysisState | null>(null)
  const biasAnalysisStateRef = useRef<BiasAnalysisState | null>(null)
  const [user] = useUser()
  const [campaign] = useCampaign()
  const office = grammarizeOfficeName(
    campaign?.details?.otherOffice || campaign?.details?.office,
  )

  const introductionOptions = introOptions({
    eoName: `${user?.firstName?.trim() || ''} ${
      user?.lastName?.trim() || ''
    }`.trim(),
    city: campaign?.details?.city || '',
    office: office || '',
  })

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Details>({
    defaultValues: details ?? {
      title: '',
      introduction: '',
      question: '',
    },
  })

  useEffect(() => {
    biasAnalysisStateRef.current = biasAnalysisState
    const currentValue = getValues('question')
    if (
      biasAnalysisState !== null &&
      currentValue.trim().length > 0 &&
      currentValue.trim().length >= MIN_QUESTION_LENGTH
    ) {
      setValue('question', currentValue, { shouldTouch: true })
      trigger('question')
    }
  }, [biasAnalysisState, trigger, setValue, getValues])

  const onSubmit = async (data: Details) => {
    // TODO: perform async validation using LLM endpoint
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If validation passes, call onChange
    onChange(data)
  }

  return (
    <FormStep
      step={Step.details}
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
          <p className="mt-1 text-sm font-normal text-red-500">
            {errors.title.message}
          </p>
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
                {introductionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.introduction && (
          <p className="mt-1 font-normal text-sm text-red-500">
            {errors.introduction.message}
          </p>
        )}

        <label className="block mb-2 mt-4">Poll Question</label>
        <Controller
          name="question"
          control={control}
          rules={{
            required: 'Question is required',
            validate: (value: string) => {
              const trimmedValue = value.trim()
              if (trimmedValue.length === 0) {
                return true
              }
              if (trimmedValue.length < MIN_QUESTION_LENGTH) {
                return `Question must be at least ${MIN_QUESTION_LENGTH} characters`
              }

              const state = biasAnalysisStateRef.current
              if (!state) {
                return true
              }
              if (state.hasServerError) {
                return 'Unable to analyze for bias, please try again later.'
              }
              if (state.hasBias && state.hasGrammar) {
                return 'Biased language detected. Grammar issues found. Please use "Optimize message" to correct it.'
              }
              if (state.hasBias) {
                return 'Biased language detected. Please use "Optimize message" to correct it.'
              }
              if (state.hasGrammar) {
                return 'Grammar issues found. Please use "Optimize message" to correct it.'
              }
              return true
            },
          }}
          render={({ field }) => (
            <PollTextBiasInput
              value={field.value}
              onChange={field.onChange}
              placeholder="What local issues matter most to you? I'd genuinely value your input. Reply to share."
              onBiasAnalysisChange={setBiasAnalysisState}
            />
          )}
        />
        {errors.question ? (
          <p className="mt-1 font-normal text-sm text-red-500">
            {errors.question.message}
          </p>
        ) : (
          <p className="mt-1.5 font-normal text-sm text-muted-foreground">
            We recommend checking your message for clarity and bias using
            optimize message.
          </p>
        )}

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

const DateSelectionForm: React.FC<{
  goBack: () => void
  onChange: (scheduledDate: Date) => void
  scheduledDate?: Date
}> = ({ goBack, onChange, scheduledDate: initialScheduledDate }) => {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialScheduledDate,
  )

  return (
    <FormStep
      step={Step.dateSelection}
      onBack={goBack}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          disabled={!scheduledDate}
          onClick={() => {
            if (!scheduledDate) {
              return
            }
            onChange(scheduledDate)
          }}
        >
          Next
        </Button>
      }
    >
      <H1 className="md:text-center">When should we send your poll?</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        You can schedule polls up to 30 days in advance. GoodParty.org sends all
        polls at 11am local time to maximize responses.
      </p>

      <DateInputCalendar
        value={scheduledDate}
        onChange={setScheduledDate}
        // Give ourselves 2 days to schedule their poll
        disabled={(date) =>
          date <= addDays(startOfDay(new Date()), 2) ||
          date > addDays(startOfDay(new Date()), 30)
        }
      />

      <p className="mt-4 text-sm text-muted-foreground text-center">
        * Messages sent on Tuesdays or Thursdays receive the highest engagement.
      </p>
    </FormStep>
  )
}

const AudienceSelectionForm: React.FC<{
  targetAudienceSize?: number
  goBack: () => void
  onChange: (targetAudienceSize: number) => void
}> = ({ targetAudienceSize, goBack, onChange }) => {
  const [selectedAudienceSize, setSelectedAudienceSize] = useState<
    number | undefined
  >(targetAudienceSize)

  const query = useQuery({
    queryKey: ['total-constituents-with-cell-phone'],
    queryFn: () =>
      clientFetch<{ meta: { totalConstituents: number } }>(
        apiRoutes.contacts.stats,
        { hasCellPhone: 'true' },
      ).then((res) => ({ totalConstituents: res.data.meta.totalConstituents })),
  })

  if (query.status !== 'success') {
    return (
      <FormStep
        step={Step.audienceSelection}
        onBack={goBack}
        nextButton={<></>}
      >
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
      step={Step.audienceSelection}
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
          Next
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
            <p>${formatCurrency(PRICE_PER_POLL_TEXT * option.count)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground text-center">
          Each message costs ${PRICE_PER_POLL_TEXT}.
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

const IamgeSelectionForm: React.FC<{
  goBack: () => void
  onChange: (imageUrl?: string) => void
  imageUrl?: string
}> = ({ goBack, onChange, imageUrl: initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)

  return (
    <FormStep
      step={Step.addImage}
      onBack={goBack}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          onClick={() => {
            onChange(imageUrl)
          }}
        >
          Next
        </Button>
      }
    >
      <H1 className="md:text-center">Would you like to add an image?</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        Text messages perform better with an image. Add your campaign headshot,
        logo or a community photo for credibility.
      </p>

      <PollImageUpload
        imageUrl={imageUrl}
        onUploaded={(imageUrl) => setImageUrl(imageUrl)}
      />
    </FormStep>
  )
}

const ReviewForm: React.FC<{
  goBack: () => void
  onSubmit: () => void
  details: Details
  targetAudienceSize: number
  scheduledDate: Date
  imageUrl?: string
}> = ({
  goBack,
  onSubmit,
  details,
  targetAudienceSize,
  scheduledDate,
  imageUrl,
}) => {
  const message = [
    details.introduction,
    details.question,
    'Text STOP to opt out.',
  ].join('\n\n')
  return (
    <FormStep
      step={Step.review}
      onBack={goBack}
      nextButton={
        <Button type="submit" variant="secondary" onClick={onSubmit}>
          Yes, Checkout
        </Button>
      }
    >
      <H1 className="md:text-center">Does everything look good?</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        Take a moment to review your poll details.
      </p>

      <MessageCard
        className="mb-6"
        title="Outreach Summary"
        description={
          <div className="flex flex-col gap-1 mt-2">
            <p>
              Audience: <b>{numberFormatter(targetAudienceSize)}</b>
            </p>
            <p>
              Send Date: <b>{scheduledDate.toDateString()} at 11:00am</b>
            </p>
            <p>
              Estimated Completion:{' '}
              <b>{addDays(scheduledDate, 3).toDateString()}</b>
            </p>
            <p>
              Cost:{' '}
              <b>${formatCurrency(PRICE_PER_POLL_TEXT * targetAudienceSize)}</b>
            </p>
          </div>
        }
      />

      <MessageCard
        title="Preview"
        description={
          <div className="flex flex-col gap-1">
            <div className="max-w-xs mx-auto">
              <TextMessagePreview
                message={
                  <div className="flex flex-col gap-2">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Campaign image"
                        width={300}
                        height={300}
                        className="object-cover rounded"
                      />
                    ) : (
                      <Image
                        src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                        alt=""
                        width={300}
                        height={300}
                      />
                    )}
                    <p className="mt-1 font-normal">{message}</p>
                  </div>
                }
              />
            </div>
          </div>
        }
      />
    </FormStep>
  )
}

export const CreatePoll: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [campaign] = useCampaign()

  const [state, setState] = useState<State>({
    step: Step.details,
  })

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      {state.step === Step.details && (
        <DetailsForm
          details={state.details}
          onChange={(details) =>
            setState({ step: Step.audienceSelection, details })
          }
        />
      )}

      {state.step === Step.audienceSelection && (
        <AudienceSelectionForm
          targetAudienceSize={state.targetAudienceSize}
          goBack={() =>
            setState({ step: Step.details, details: state.details })
          }
          onChange={(targetAudienceSize) =>
            setState({
              step: Step.dateSelection,
              details: state.details,
              targetAudienceSize,
            })
          }
        />
      )}

      {state.step === Step.dateSelection && (
        <DateSelectionForm
          scheduledDate={state.scheduledDate}
          goBack={() =>
            setState({
              step: Step.audienceSelection,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
            })
          }
          onChange={(scheduledDate) =>
            setState({
              step: Step.addImage,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
              scheduledDate,
            })
          }
        />
      )}

      {state.step === Step.addImage && (
        <IamgeSelectionForm
          goBack={() =>
            setState({
              step: Step.dateSelection,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
              scheduledDate: state.scheduledDate,
            })
          }
          onChange={(imageUrl) =>
            setState({
              step: Step.review,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
              scheduledDate: state.scheduledDate,
              imageUrl,
            })
          }
          imageUrl={state.imageUrl}
        />
      )}

      {state.step === Step.review && (
        <ReviewForm
          goBack={() =>
            setState({
              step: Step.addImage,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
              scheduledDate: state.scheduledDate,
              imageUrl: state.imageUrl,
            })
          }
          onSubmit={() =>
            setState({
              step: Step.payment,
              details: state.details,
              targetAudienceSize: state.targetAudienceSize,
              scheduledDate: state.scheduledDate,
              imageUrl: state.imageUrl,
            })
          }
          details={state.details}
          targetAudienceSize={state.targetAudienceSize}
          scheduledDate={state.scheduledDate}
          imageUrl={state.imageUrl}
        />
      )}

      {/* TODO: fill out remaining steps */}
    </DashboardLayout>
  )
}
