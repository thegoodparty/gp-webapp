import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { APP_BASE } from 'appEnv'
import { getBriefingBySlug } from '@shared/briefings/server'
import { briefingsLandingHref } from '@shared/briefings/routes'
import serveAccess from '../../shared/serveAccess'
import DashboardLayout from '../../shared/DashboardLayout'
import DetailHeader from '../components/detail/DetailHeader'
import DetailToc from '../components/detail/DetailToc'
import MobileBottomBar from '../components/detail/MobileBottomBar'
import AnnotationsScope from '../components/annotations/AnnotationsScope'
import BriefingAwaitingPage from '../components/BriefingAwaitingPage'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

/**
 * Shared chrome for every briefing page: sticky header, sidebar TOC,
 * mobile bottom bar, and the annotations scope. Children render in the
 * main content column.
 *
 * Per-page content lives at:
 *   /dashboard/briefings/[slug]            -> Executive Summary + top issues
 *   /dashboard/briefings/[slug]/[itemId]   -> Single agenda item
 */
export default async function BriefingChromeLayout({
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
        <BriefingAwaitingPage briefing={briefing} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pathname="/dashboard/briefings"
      showAlert={false}
      wrapperClassName="!p-0"
    >
      <AnnotationsScope meetingDate={slug}>
        <div className="relative">
          <div className="flex min-h-full flex-col bg-muted pb-20 lg:pb-12">
            <DetailHeader
              briefing={briefing}
              preparedForLine={briefing.officialName}
              liveBriefingUrl={`${APP_BASE}/dashboard/briefings/${slug}`}
            />

            <div className="mx-auto w-full max-w-[1120px] px-4 py-6 lg:px-8">
              <div className="mb-4">
                <Link
                  href={briefingsLandingHref()}
                  className="inline-flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back to meetings
                </Link>
              </div>

              <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
                <aside className="hidden lg:block">
                  <div className="sticky top-[88px] max-h-[calc(100vh-104px)] overflow-y-auto rounded-2xl border border-border bg-card p-3">
                    <DetailToc briefingSlug={slug} items={briefing.items} />
                  </div>
                </aside>

                <div className="flex flex-col gap-4">{children}</div>
              </div>
            </div>
          </div>

          <MobileBottomBar briefingSlug={slug} items={briefing.items} />
        </div>
      </AnnotationsScope>
    </DashboardLayout>
  )
}
