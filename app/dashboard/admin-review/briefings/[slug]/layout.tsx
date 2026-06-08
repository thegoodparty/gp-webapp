import { notFound } from 'next/navigation'
import { getBriefingBySlug } from '@shared/briefings/server'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
} from '@shared/briefings/routes'
import ReviewAnnotationsScope from '@shared/annotations/review/ReviewAnnotationsScope'
import serveAccess from '../../../shared/serveAccess'
import DashboardLayout from '../../../shared/DashboardLayout'
import ActiveCardScrollSpy from '../../../briefings/components/detail/ActiveCardScrollSpy'
import DetailToc from '../../../briefings/components/detail/DetailToc'
import ShareScope from '../../../briefings/components/detail/ShareScope'
import BriefingAwaitingPage from '../../../briefings/components/BriefingAwaitingPage'
import ReviewDetailHeader from '../components/ReviewDetailHeader'
import ReviewBottomBars from '../components/ReviewBottomBars'
import AdminReviewGate from '../components/AdminReviewGate'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

/**
 * Admin-review chrome — a parallel of the candidate-facing briefing layout.
 * Structurally identical (sticky header, sidebar TOC, scroll-spy, responsive
 * containers, ShareScope) but mounts ReviewAnnotationsScope instead of
 * AnnotationsScope and uses review-only header / bottom-bar variants. The
 * whole subtree is gated to impersonating staff via AdminReviewGate.
 */
export default async function AdminReviewBriefingChromeLayout({
  params,
  children,
}: Props): Promise<React.JSX.Element> {
  await serveAccess()
  const { slug } = await params
  const briefing = await getBriefingBySlug(slug)
  if (!briefing) notFound()

  if ('status' in briefing) {
    return (
      <DashboardLayout
        pathname="/dashboard/briefings"
        showAlert={false}
        wrapperClassName="!p-0"
      >
        <AdminReviewGate slug={slug}>
          <BriefingAwaitingPage briefing={briefing} />
        </AdminReviewGate>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pathname="/dashboard/briefings"
      showAlert={false}
      wrapperClassName="!p-0"
    >
      <AdminReviewGate slug={slug}>
        <ReviewAnnotationsScope
          meetingDate={slug}
          items={briefing.items}
          initialActiveCard={{
            key: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
            jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
            titleJsonPath: BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
            title: 'Executive Summary',
          }}
        >
          <ActiveCardScrollSpy items={briefing.items} />
          <ShareScope briefing={briefing}>
            <div className="relative">
              <div className="flex min-h-full flex-col bg-muted pb-20 lg:h-svh lg:min-h-0 lg:overflow-hidden lg:pb-20">
                <ReviewDetailHeader briefing={briefing} />

                <div className="mx-auto w-full max-w-[1120px] px-4 py-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:px-8">
                  <div className="lg:flex lg:min-h-0 lg:flex-1 lg:items-stretch lg:gap-8 lg:overflow-hidden">
                    <aside className="hidden rounded-2xl border border-border bg-card p-3 lg:block lg:w-[260px] lg:shrink-0 lg:overflow-y-auto">
                      <DetailToc briefingSlug={slug} items={briefing.items} />
                    </aside>

                    <div
                      id="briefing-detail-pane"
                      data-briefing-scroll-container
                      style={{ WebkitTouchCallout: 'none' }}
                      className="flex flex-col gap-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-0.5"
                    >
                      {children}
                    </div>
                  </div>
                </div>
              </div>

              <ReviewBottomBars />
            </div>
          </ShareScope>
        </ReviewAnnotationsScope>
      </AdminReviewGate>
    </DashboardLayout>
  )
}
