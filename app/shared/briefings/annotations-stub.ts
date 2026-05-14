/**
 * localStorage-backed AnnotationsClient for development.
 *
 * Persists annotations across reloads so the highlight layer can demo
 * end-to-end without the gp-api server. Swap for the real client in
 * app/shared/briefings/annotations-api.ts (to be added) once endpoints ship.
 *
 * Storage layout under one key per briefing:
 *   gp.briefings.annotations.<briefingId> -> Annotation[]
 */

'use client'

import type {
  Annotation,
  AnnotationKind,
  AnnotationNoteData,
  AnnotationBugReportData,
  AnnotationChatData,
  CreateAnnotationInput,
} from './types'
import type { AnnotationsClient } from './annotations-client'
import { chatStub } from './chat-stub'

const STORAGE_PREFIX = 'gp.briefings.annotations.'
const DEV_USER_ID = 1

function storageKey(briefingId: string) {
  return STORAGE_PREFIX + briefingId
}

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readAll(briefingId: string): Annotation[] {
  const s = safeStorage()
  if (!s) return []
  const raw = s.getItem(storageKey(briefingId))
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as Annotation[]
    return []
  } catch {
    return []
  }
}

function writeAll(briefingId: string, items: Annotation[]) {
  const s = safeStorage()
  if (!s) return
  s.setItem(storageKey(briefingId), JSON.stringify(items))
}

function newId(prefix: string) {
  return (
    prefix +
    '_' +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  )
}

function nowIso() {
  return new Date().toISOString()
}

function findOwning(
  annotationId: string,
): { briefingId: string; index: number; annotation: Annotation } | null {
  const s = safeStorage()
  if (!s) return null
  for (let i = 0; i < s.length; i++) {
    const key = s.key(i)
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue
    const briefingId = key.slice(STORAGE_PREFIX.length)
    const items = readAll(briefingId)
    const idx = items.findIndex((a) => a.id === annotationId)
    if (idx >= 0) {
      const annotation = items[idx]
      if (!annotation) continue
      return { briefingId, index: idx, annotation }
    }
  }
  return null
}

async function createNote(
  briefingId: string,
  input: Extract<CreateAnnotationInput, { kind: 'note' }>,
): Promise<Annotation> {
  const note: AnnotationNoteData = {
    id: newId('note'),
    body: input.payload.body,
    attachments: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  return finalize(briefingId, 'note', input, { note })
}

async function createBugReport(
  briefingId: string,
  input: Extract<CreateAnnotationInput, { kind: 'bug_report' }>,
): Promise<Annotation> {
  const bugReport: AnnotationBugReportData = {
    id: newId('bug'),
    description: input.payload.description,
    submittedAt: nowIso(),
  }
  return finalize(briefingId, 'bug_report', input, { bugReport })
}

async function createChat(
  briefingId: string,
  input: Extract<CreateAnnotationInput, { kind: 'chat' }>,
): Promise<Annotation> {
  const conversation = await chatStub.create({
    initialMessage: input.payload.firstMessage ?? null,
  })
  const chat: AnnotationChatData = {
    id: conversation.id,
    createdAt: conversation.createdAt,
  }
  return finalize(briefingId, 'chat', input, { chat })
}

function finalize(
  briefingId: string,
  kind: AnnotationKind,
  input: CreateAnnotationInput,
  extras: Partial<Pick<Annotation, 'note' | 'bugReport' | 'chat'>>,
): Annotation {
  const annotation: Annotation = {
    id: newId('ann'),
    kind,
    resourceType: 'briefing',
    resourceId: briefingId,
    authorUserId: DEV_USER_ID,
    jsonPath: input.anchor.jsonPath,
    start: input.anchor.start,
    end: input.anchor.end,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ...extras,
  }
  const items = readAll(briefingId)
  items.push(annotation)
  writeAll(briefingId, items)
  return annotation
}

export const annotationsStub: AnnotationsClient = {
  async list(briefingId) {
    return readAll(briefingId)
  },

  async create(briefingId, input) {
    if (input.kind === 'note') return createNote(briefingId, input)
    if (input.kind === 'bug_report') return createBugReport(briefingId, input)
    return createChat(briefingId, input)
  },

  async updateNote(annotationId, body) {
    const owning = findOwning(annotationId)
    if (!owning) {
      throw new Error('annotation_not_found')
    }
    const { briefingId, index, annotation } = owning
    if (annotation.kind !== 'note' || !annotation.note) {
      throw new Error('annotation_not_a_note')
    }
    const updated: Annotation = {
      ...annotation,
      updatedAt: nowIso(),
      note: { ...annotation.note, body, updatedAt: nowIso() },
    }
    const items = readAll(briefingId)
    items[index] = updated
    writeAll(briefingId, items)
    return updated
  },

  async delete(annotationId) {
    const owning = findOwning(annotationId)
    if (!owning) return
    const { briefingId, index, annotation } = owning
    if (annotation.kind === 'chat' && annotation.chat) {
      await chatStub.softDelete(annotation.chat.id)
    }
    const items = readAll(briefingId)
    items.splice(index, 1)
    writeAll(briefingId, items)
  },
}
