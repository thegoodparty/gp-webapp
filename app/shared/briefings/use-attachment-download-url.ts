'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getAttachmentDownloadUrl,
  type AttachmentDownloadUrl,
} from './attachments-api'

/**
 * Stable React Query cache key for a server-side attachment's signed S3
 * URL. Keyed by (annotationId, attachmentId) so the URL is shared across
 * any UI that renders the same attachment (thumbnail in the picker,
 * full-size view in a future lightbox, etc.).
 */
export const attachmentDownloadUrlQueryKey = (
  annotationId: string,
  attachmentId: string,
): readonly unknown[] =>
  [
    'briefings',
    'annotations',
    annotationId,
    'attachments',
    attachmentId,
    'download-url',
  ] as const

/**
 * Fetches the signed S3 GET URL for an attachment. The URL is good for
 * ~15 minutes server-side; we treat it as fresh for 10 minutes locally
 * so the next render still hits cache, then refetch in the background
 * to keep `<img src>` thumbnails from breaking on a stale URL.
 *
 * Pass `enabled: false` to suppress the request — useful when the
 * attachment is still being uploaded and its server id isn't known yet.
 */
export function useAttachmentDownloadUrl(
  annotationId: string,
  attachmentId: string,
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true
  return useQuery<AttachmentDownloadUrl>({
    queryKey: attachmentDownloadUrlQueryKey(annotationId, attachmentId),
    queryFn: () => getAttachmentDownloadUrl({ annotationId, attachmentId }),
    staleTime: 10 * 60 * 1000,
    enabled,
  })
}
