import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import {
  AgendaFileTooLargeError,
  AgendaFileWrongTypeError,
  MAX_AGENDA_BYTES,
  submitAgendaFile,
  submitAgendaUrl,
} from './agenda-upload-api'
import { api, mswServer } from 'helpers/test-utils/api-mocking'

const S3_PUT_URL = 'https://s3.example/upload?sig=abc'

const fakeFile = (name: string, type: string, size = 1024): File => {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

const okPresign = (uploadId = 'upload-uuid') => ({
  uploadId,
  uploadKey: `agendas/eo-1/2026-07-15/${uploadId}.pdf`,
  uploadUrl: S3_PUT_URL,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
})

const mockS3Put = (status = 200) => {
  const spy = vi.fn(
    (_args: { request: Request }) => new HttpResponse(null, { status }),
  )
  mswServer.use(http.put(S3_PUT_URL, ({ request }) => spy({ request })))
  return spy
}

afterEach(() => {
  api.reset()
})

describe('submitAgendaUrl', () => {
  it('POSTs source=URL with sourceUrl and returns the submit response', async () => {
    let submitBody: unknown
    api.mock('POST /v1/meetings/:date/briefing/agenda', ({ body }) => {
      submitBody = body
      return {
        status: 200,
        data: { experimentRunId: 'run-1', status: 'processing' as const },
      }
    })

    const result = await submitAgendaUrl(
      '2026-07-15',
      'https://example.gov/packet.pdf',
    )

    expect(result).toEqual({ experimentRunId: 'run-1', status: 'processing' })
    expect(submitBody).toMatchObject({
      source: 'URL',
      sourceUrl: 'https://example.gov/packet.pdf',
    })
  })
})

describe('submitAgendaFile happy path', () => {
  it('walks presign → S3 PUT → finalize and forwards only uploadId (no uploadKey)', async () => {
    let presignBody: unknown
    api.mock('POST /v1/meetings/:date/briefing/agenda/presign', ({ body }) => {
      presignBody = body
      return { status: 200, data: okPresign('upload-42') }
    })
    let submitBody: unknown
    api.mock('POST /v1/meetings/:date/briefing/agenda', ({ body }) => {
      submitBody = body
      return {
        status: 200,
        data: { experimentRunId: 'run-7', status: 'processing' as const },
      }
    })
    const putSpy = mockS3Put(200)

    const result = await submitAgendaFile(
      '2026-07-15',
      fakeFile('agenda.pdf', 'application/pdf', 4096),
    )

    expect(result).toEqual({ experimentRunId: 'run-7', status: 'processing' })
    expect(presignBody).toMatchObject({
      contentType: 'application/pdf',
      byteSize: 4096,
    })
    expect(putSpy).toHaveBeenCalledOnce()
    // The crucial assertion: uploadKey is NEVER sent to gp-api on finalize.
    // Server reconstructs it from electedOffice + meetingDate + uploadId.
    expect(submitBody).toEqual({
      source: 'UPLOAD',
      uploadId: 'upload-42',
    })
  })

  it('sends Content-Type: application/pdf on the S3 PUT', async () => {
    api.mock('POST /v1/meetings/:date/briefing/agenda/presign', () => ({
      status: 200,
      data: okPresign(),
    }))
    api.mock('POST /v1/meetings/:date/briefing/agenda', () => ({
      status: 200,
      data: { experimentRunId: 'run-1', status: 'processing' as const },
    }))
    const putSpy = mockS3Put(200)

    await submitAgendaFile(
      '2026-07-15',
      fakeFile('agenda.pdf', 'application/pdf'),
    )

    expect(putSpy).toHaveBeenCalledOnce()
    const putReq = putSpy.mock.calls[0]![0].request
    expect(putReq.headers.get('content-type')).toBe('application/pdf')
  })
})

describe('submitAgendaFile client-side validation', () => {
  it('throws AgendaFileWrongTypeError for non-PDF mime', async () => {
    await expect(
      submitAgendaFile('2026-07-15', fakeFile('image.png', 'image/png')),
    ).rejects.toBeInstanceOf(AgendaFileWrongTypeError)
  })

  it('throws AgendaFileTooLargeError when file exceeds the cap', async () => {
    await expect(
      submitAgendaFile(
        '2026-07-15',
        fakeFile('big.pdf', 'application/pdf', MAX_AGENDA_BYTES + 1),
      ),
    ).rejects.toBeInstanceOf(AgendaFileTooLargeError)
  })

  it('accepts a PDF with empty MIME type if the extension is .pdf (Android pickers)', async () => {
    // Some Android file pickers report file.type as ''. The client looks at
    // the extension as a fallback. We don't assert deep wiring here — just
    // that the call doesn't throw the wrong-type error.
    api.mock('POST /v1/meetings/:date/briefing/agenda/presign', () => ({
      status: 200,
      data: okPresign(),
    }))
    api.mock('POST /v1/meetings/:date/briefing/agenda', () => ({
      status: 200,
      data: { experimentRunId: 'run-1', status: 'processing' as const },
    }))
    mockS3Put(200)

    await expect(
      submitAgendaFile('2026-07-15', fakeFile('agenda.pdf', '', 1024)),
    ).resolves.toBeDefined()
  })

  it('rejects a non-.pdf filename with empty MIME', async () => {
    await expect(
      submitAgendaFile('2026-07-15', fakeFile('mystery', '', 1024)),
    ).rejects.toBeInstanceOf(AgendaFileWrongTypeError)
  })
})

describe('submitAgendaFile error propagation', () => {
  it('throws when the S3 PUT fails', async () => {
    api.mock('POST /v1/meetings/:date/briefing/agenda/presign', () => ({
      status: 200,
      data: okPresign(),
    }))
    mockS3Put(403)

    await expect(
      submitAgendaFile('2026-07-15', fakeFile('agenda.pdf', 'application/pdf')),
    ).rejects.toThrow(/s3_upload_failed:403/)
  })
})
