'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import DashboardLayout from '../../shared/DashboardLayout'
import { useState, useEffect, useMemo } from 'react'
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
import { LuLoaderCircle } from 'react-icons/lu'
import { numberFormatter } from 'helpers/numberHelper'
import {
  PollAudienceSelection,
  PollAudienceSelector,
  useTotalConstituentsWithCellPhone,
} from '../shared/audience-selection'
import { PollImageUpload } from '../components/PollImageUpload'
import { grammarizeOfficeName } from 'app/polls/onboarding/utils/grammarizeOfficeName'
import { validatePollQuestion, getWarningMessage } from './utils'
import { QuestionFeedback } from './QuestionFeedback'
import { useUser } from '@shared/hooks/useUser'
import { PollPayment, PollPurchaseType } from '../shared/components/PollPayment'
import { uuidv7 } from 'uuidv7'
import { PollPaymentSuccess } from '../shared/components/PollPaymentSuccess'
import {
  POLLS_SCHEDULING_COPY,
  PollScheduledDateSelector,
} from '../components/PollScheduledDateSelector'
import { PollPreview } from '../components/PollPreview'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PRICE_PER_POLL_TEXT } from '../shared/constants'

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
      targetAudience?: PollAudienceSelection
    }
  | {
      step: Step.dateSelection
      details: Details
      targetAudience: PollAudienceSelection
      scheduledDate?: Date
    }
  | {
      step: Step.addImage
      details: Details
      targetAudience: PollAudienceSelection
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.review
      details: Details
      targetAudience: PollAudienceSelection
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.payment
      details: Details
      targetAudience: PollAudienceSelection
      scheduledDate: Date
      imageUrl?: string
    }
  | {
      step: Step.paymentConfirmed
      pollId: string
      scheduledDate: Date
      targetAudience: PollAudienceSelection
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

const FormContent: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="flex flex-col">
    <main className="flex-1 pb-140 md:pb-0">
      <section className="max-w-screen-md mx-auto bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12 xs:pt-4 md:mb-16">
        {children}
      </section>
    </main>
  </div>
)

const useEvent = (event: string, props?: Record<string, any>) => {
  useEffect(() => {
    trackEvent(event, props)
  }, [])
}

const FormStep: React.FC<{
  step: Step
  onBack: () => void
  nextButton: React.ReactNode
  children: React.ReactNode
}> = ({ step, onBack, nextButton, children }) => {
  return (
    <FormContent>
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
    </FormContent>
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

const STOP_MESSAGE = 'Text STOP to opt out'

const toMessage = (details: Details): string =>
  [details.introduction, details.question, STOP_MESSAGE]
    .map((line) => line.trim())
    .join('\n\n')
    .replaceAll('[Name]', '{{first_name}}')
    .trim()

const DetailsForm: React.FC<{
  details?: Details
  onChange: (details: Details) => void
}> = ({ details, onChange }) => {
  const router = useRouter()
  const [biasAnalysisState, setBiasAnalysisState] =
    useState<BiasAnalysisState | null>(null)

  const warningMessage = useMemo(
    () => getWarningMessage(biasAnalysisState),
    [biasAnalysisState],
  )

  const [user] = useUser()
  const [campaign] = useCampaign()
  const office = grammarizeOfficeName(
    campaign?.details?.otherOffice || campaign?.details?.office || '',
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
    trackEvent(EVENTS.createPoll.pollQuestionCompleted, {
      Introduction: introductionOptions.indexOf(data.introduction) + 1,
    })
  }

  useEvent(EVENTS.createPoll.pollQuestionViewed)

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
              <SelectContent className="max-w-[calc(100vw-2rem)]">
                {introductionOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="whitespace-normal"
                  >
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
            validate: validatePollQuestion,
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
        <QuestionFeedback
          warningMessage={warningMessage}
          errorMessage={errors.question?.message}
        />

        <label className="block mb-2 mt-4">Poll Closing</label>
        <Input
          className="bg-muted color-muted-foreground"
          value={STOP_MESSAGE}
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

  useEvent(EVENTS.createPoll.schedulePollViewed)

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
            trackEvent(EVENTS.createPoll.schedulePollCompleted, {
              ScheduledDate: scheduledDate.toDateString(),
            })
            onChange(scheduledDate)
          }}
        >
          Next
        </Button>
      }
    >
      <H1 className="md:text-center">When should we send your poll?</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        {POLLS_SCHEDULING_COPY}
      </p>

      <PollScheduledDateSelector
        scheduledDate={scheduledDate}
        onChange={setScheduledDate}
      />
    </FormStep>
  )
}

const AudienceSelectionForm: React.FC<{
  targetAudience?: PollAudienceSelection
  goBack: () => void
  onChange: (targetAudience: PollAudienceSelection) => void
}> = ({ targetAudience, goBack, onChange }) => {
  const [selectedAudience, setSelectedAudience] = useState<
    PollAudienceSelection | undefined
  >(targetAudience)

  const query = useTotalConstituentsWithCellPhone()

  useEvent(EVENTS.createPoll.audienceSelectionViewed)

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

  return (
    <FormStep
      step={Step.audienceSelection}
      onBack={goBack}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          disabled={!selectedAudience}
          onClick={() => {
            if (!selectedAudience) {
              return
            }
            trackEvent(EVENTS.createPoll.audienceSelectionCompleted, {
              Selection: selectedAudience.optionIndex,
              RecommendedSelection: selectedAudience.isRecommended,
              Count: selectedAudience.count,
              Cost: selectedAudience.count * PRICE_PER_POLL_TEXT,
            })

            onChange(selectedAudience)
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
        You can text up to {numberFormatter(query.data.totalConstituents)} more
        constituents. We won&apos;t send text messages to constituents
        you&apos;ve already messaged.
      </p>

      <PollAudienceSelector
        expectedResponseRate={0.03}
        totalConstituentsWithCellPhone={query.data.totalConstituents}
        alreadySent={0}
        responsesAlreadyReceived={0}
        onSelect={setSelectedAudience}
        showRecommended={true}
      />
    </FormStep>
  )
}

const ImageSelectionForm: React.FC<{
  goBack: () => void
  onChange: (imageUrl?: string) => void
  imageUrl?: string
}> = ({ goBack, onChange, imageUrl: initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)

  useEvent(EVENTS.createPoll.addImageViewed)

  return (
    <FormStep
      step={Step.addImage}
      onBack={goBack}
      nextButton={
        <Button
          type="submit"
          variant="secondary"
          onClick={() => {
            trackEvent(EVENTS.createPoll.addImageCompleted, {
              Image: !!imageUrl,
            })
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
  targetAudience: PollAudienceSelection
  scheduledDate: Date
  imageUrl?: string
}> = ({
  goBack,
  onSubmit,
  details,
  targetAudience,
  scheduledDate,
  imageUrl,
}) => {
  useEvent(EVENTS.createPoll.pollPreviewViewed)

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
        <Button
          type="submit"
          variant="secondary"
          onClick={() => {
            trackEvent(EVENTS.createPoll.pollPreviewCompleted)
            onSubmit()
          }}
        >
          Yes, Checkout
        </Button>
      }
    >
      <H1 className="md:text-center">Does everything look good?</H1>
      <p className="text-left md:text-center mt-4 mb-8 text-lg font-normal text-muted-foreground">
        Take a moment to review your poll details.
      </p>

      <PollPreview
        scheduledDate={scheduledDate}
        targetAudienceSize={targetAudience.count}
        imageUrl={imageUrl}
        message={message}
        isFree={false}
      />
    </FormStep>
  )
}

const PaymentForm: React.FC<{
  goBack: () => void
  onComplete: () => void
  pollId: string
  details: Details
  targetAudienceSize: number
  scheduledDate: Date
  imageUrl?: string
}> = ({
  goBack,
  onComplete,
  pollId,
  details,
  targetAudienceSize,
  scheduledDate,
  imageUrl,
}) => {
  useEvent(EVENTS.createPoll.paymentViewed)
  return (
    <FormStep step={Step.payment} onBack={goBack} nextButton={<></>}>
      <PollPayment
        purchaseMetaData={{
          pollPurchaseType: PollPurchaseType.new,
          pollId,
          name: details.title,
          message: toMessage(details),
          imageUrl: imageUrl,
          audienceSize: targetAudienceSize,
          scheduledDate: scheduledDate.toISOString(),
        }}
        onConfirmed={onComplete}
      />
    </FormStep>
  )
}

const SuccessForm: React.FC<{
  pollId: string
  targetAudience: PollAudienceSelection
  scheduledDate: Date
}> = ({ pollId, targetAudience, scheduledDate }) => {
  const [user] = useUser()
  useEvent(EVENTS.createPoll.paymentCompleted, {
    cost: targetAudience.count * PRICE_PER_POLL_TEXT,
    count: targetAudience.count,
    type: 'New Serve Poll',
    email: user?.email || 'Unknown',
    hubspotId: user?.metaData?.hubspotId || 'Unknown',
  })

  return (
    <FormContent>
      <PollPaymentSuccess
        className="p-8"
        scheduledDate={scheduledDate}
        textsPaidFor={targetAudience.count}
        redirectTo={`/dashboard/polls/${pollId}`}
      />
    </FormContent>
  )
}
export const CreatePoll: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [campaign] = useCampaign()

  const [pollId] = useState(() => uuidv7())

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
          targetAudience={state.targetAudience}
          goBack={() =>
            setState({ step: Step.details, details: state.details })
          }
          onChange={(targetAudience) =>
            setState({
              step: Step.dateSelection,
              details: state.details,
              targetAudience,
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
              targetAudience: state.targetAudience,
            })
          }
          onChange={(scheduledDate) =>
            setState({
              step: Step.addImage,
              details: state.details,
              targetAudience: state.targetAudience,
              scheduledDate,
            })
          }
        />
      )}

      {state.step === Step.addImage && (
        <ImageSelectionForm
          goBack={() =>
            setState({
              step: Step.dateSelection,
              details: state.details,
              targetAudience: state.targetAudience,
              scheduledDate: state.scheduledDate,
            })
          }
          onChange={(imageUrl) =>
            setState({
              step: Step.review,
              details: state.details,
              targetAudience: state.targetAudience,
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
              targetAudience: state.targetAudience,
              scheduledDate: state.scheduledDate,
              imageUrl: state.imageUrl,
            })
          }
          onSubmit={() =>
            setState({
              step: Step.payment,
              details: state.details,
              targetAudience: state.targetAudience,
              scheduledDate: state.scheduledDate,
              imageUrl: state.imageUrl,
            })
          }
          details={state.details}
          targetAudience={state.targetAudience}
          scheduledDate={state.scheduledDate}
          imageUrl={state.imageUrl}
        />
      )}

      {state.step === Step.payment && (
        <PaymentForm
          goBack={() =>
            setState({
              step: Step.review,
              details: state.details,
              targetAudience: state.targetAudience,
              scheduledDate: state.scheduledDate,
              imageUrl: state.imageUrl,
            })
          }
          onComplete={() =>
            setState({
              step: Step.paymentConfirmed,
              pollId,
              scheduledDate: state.scheduledDate,
              targetAudience: state.targetAudience,
            })
          }
          pollId={pollId}
          details={state.details}
          targetAudienceSize={state.targetAudience.count}
          scheduledDate={state.scheduledDate}
          imageUrl={state.imageUrl}
        />
      )}

      {state.step === Step.paymentConfirmed && (
        <SuccessForm
          pollId={pollId}
          targetAudience={state.targetAudience}
          scheduledDate={state.scheduledDate}
        />
      )}
    </DashboardLayout>
  )
}
