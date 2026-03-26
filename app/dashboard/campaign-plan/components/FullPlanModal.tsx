'use client'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  ScrollArea,
} from '@styleguide'
import { Campaign, AiContentData } from 'helpers/types'
import { dateUsHelper } from 'helpers/dateHelper'

interface FullPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign
}

const PLAN_SECTION_KEYS = [
  'campaignPlan',
  'strategicLandscape',
  'timeline',
  'budget',
  'community',
  'voterContactPlan',
]

function isAiContentData(value: unknown): value is AiContentData {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return 'content' in value && 'name' in value
}

function PlanHeader({ campaign }: { campaign: Campaign }) {
  const { details, firstName, lastName } = campaign
  const candidateName =
    firstName && lastName ? `${firstName} ${lastName}` : undefined
  const office = details?.office || details?.otherOffice
  const city = details?.city
  const state = details?.state
  const location = [office, city, state].filter(Boolean).join(', ')
  const electionDate = details?.electionDate
  const primaryDate = details?.primaryElectionDate
  const generatedDate = campaign.updatedAt

  return (
    <div className="text-sm leading-5 text-muted-foreground">
      {candidateName && <p>{candidateName}</p>}
      {location && <p>{location}</p>}
      {electionDate && <p>Election Date: {dateUsHelper(electionDate)}</p>}
      {!primaryDate && <p>No Primary Election</p>}
      {primaryDate && <p>Primary Election: {dateUsHelper(primaryDate)}</p>}
      {generatedDate && (
        <p>
          Generated on:{' '}
          {dateUsHelper(
            typeof generatedDate === 'string'
              ? generatedDate
              : new Date(generatedDate).toISOString(),
          )}
        </p>
      )}
    </div>
  )
}

function PlanContent({ campaign }: { campaign: Campaign }) {
  const { aiContent } = campaign
  if (!aiContent) return null

  const sections = PLAN_SECTION_KEYS.map((key) => {
    const data = aiContent[key]
    if (!isAiContentData(data)) return null
    return { key, name: data.name, content: data.content }
  }).filter(Boolean) as { key: string; name: string; content: string }[]

  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.key} className="flex flex-col gap-3">
          <h2 className="font-outfit text-xl font-medium leading-7 text-foreground">
            {section.name}
          </h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-medium prose-h3:text-lg prose-h3:font-opensans prose-h4:text-sm prose-h4:font-opensans prose-h4:font-medium prose-ul:list-disc prose-li:ms-[21px]"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  )
}

export default function FullPlanModal({
  open,
  onOpenChange,
  campaign,
}: FullPlanModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="px-6 pt-4 pb-0">
            <DrawerTitle className="text-lg font-semibold leading-none">
              Your Full Plan
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-auto px-6 pb-6 pt-4">
            <PlanHeader campaign={campaign} />
            <div className="mt-6">
              <PlanContent campaign={campaign} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-[425px] gap-4 overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-semibold leading-none">
            Your Full Plan
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-80px)] overflow-auto px-6 pb-6">
          <PlanHeader campaign={campaign} />
          <div className="mt-6">
            <PlanContent campaign={campaign} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
