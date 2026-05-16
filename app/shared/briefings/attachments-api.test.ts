import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import {
  uploadAttachment,
  deleteAttachment,
  resolveMimeType,
} from './attachments-api'
import { api, mswServer } from 'helpers/test-utils/api-mocking'

const S3_PUT_URL = 'https://s3.example/upload?sig=abc'

const fakeFile = (name: string, type: string, size = 1024): File => {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

const okPresign = (attachmentId = 'att_1') => ({
  attachment_id: attachmentId,
  upload_url: S3_PUT_URL,
  storage_key: `annotations/ann_1/${attachmentId}`,
})

// MSW handler factory for the S3 PUT URL. Returns a vi.fn() the caller can
// assert on. mswServer is the shared MSW instance owned by api-mocking;
// `server.use()` adds runtime-scoped handlers that the api-mocking beforeEach
// resets between tests.
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

describe('resolveMimeType', () => {
  it('returns file.type when present', () => {
    expect(resolveMimeType(fakeFile('a.pdf', 'application/pdf'))).toBe(
      'application/pdf',
    )
  })

  it('falls back to extension for empty type — .docx', () => {
    expect(resolveMimeType(fakeFile('notes.docx', ''))).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    )
  })

  it('falls back to extension for empty type — .txt', () => {
    expect(resolveMimeType(fakeFile('plan.txt', ''))).toBe('text/plain')
  })

  it('falls back to extension for empty type — image', () => {
    expect(resolveMimeType(fakeFile('photo.jpg', ''))).toBe('image/jpeg')
    expect(resolveMimeType(fakeFile('photo.JPEG', ''))).toBe('image/jpeg')
    expect(resolveMimeType(fakeFile('photo.png', ''))).toBe('image/png')
  })

  it('returns empty string when no type and no usable extension', () => {
    expect(resolveMimeType(fakeFile('unknown', ''))).toBe('')
    expect(resolveMimeType(fakeFile('unknown.xyz', ''))).toBe('')
  })
})

describe('uploadAttachment happy path', () => {
  it('walks presign → S3 PUT → complete and returns the attachment id', async () => {
    let presignBody: unknown
    api.mock(
      'POST /v1/annotations/:annotationId/note/attachments/presign',
      ({ body }) => {
        presignBody = body
        return { status: 200, data: okPresign('att_42') }
      },
    )
    let completeParams: unknown
    api.mock(
      'POST /v1/annotations/:annotationId/note/attachments/:attachmentId/complete',
      ({ params }) => {
        completeParams = params
        return { status: 200, data: undefined }
      },
    )
    const putSpy = mockS3Put(200)

    const result = await uploadAttachment({
      annotationId: 'ann_1',
      file: fakeFile('agenda.pdf', 'application/pdf', 4096),
    })

    expect(result).toEqual({ attachmentId: 'att_42' })
    // annotationId travels in the URL path, not the JSON body.
    expect(presignBody).toMatchObject({
      file_name: 'agenda.pdf',
      mime_type: 'application/pdf',
      size_bytes: 4096,
    })
    expect(putSpy).toHaveBeenCalledOnce()
    expect(completeParams).toMatchObject({
      annotationId: 'ann_1',
      attachmentId: 'att_42',
    })
  })

  it('sends the resolved mime when file.type is empty (.docx)', async () => {
    let presignBody: unknown
    api.mock(
      'POST /v1/annotations/:annotationId/note/attachments/presign',
      ({ body }) => {
        presignBody = body
        return { status: 200, data: okPresign() }
      },
    )
    api.mock(
      'POST /v1/annotations/:annotationId/note/attachments/:attachmentId/complete',
      { status: 200, data: undefined },
    )
    const putSpy = mockS3Put(200)

    await uploadAttachment({
      annotationId: 'ann_1',
      file: fakeFile('handwritten.docx', ''),
    })

    expect(presignBody).toMatchObject({
      mime_type:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    // S3 PUT request must carry the same Content-Type so the presigned URL
    // signature matches.
    const call = putSpy.mock.calls[0]?.[0]
    expect(call?.request.headers.get('content-type')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    )
  })
})

describe('uploadAttachment error paths', () => {
  it('propagates presign failure (e.g. 400 from contract validation)', async () => {
    api.mock('POST /v1/annotations/:annotationId/note/attachments/presign', {
      status: 400,
      data: { message: 'Validation failed' },
    })
    const putSpy = mockS3Put(200)

    await expect(
      uploadAttachment({
        annotationId: 'ann_1',
        file: fakeFile('agenda.pdf', 'application/pdf'),
      }),
    ).rejects.toThrow()
    expect(putSpy).not.toHaveBeenCalled()
  })

  it('throws s3_upload_failed:<status> when S3 PUT returns non-2xx', async () => {
    api.mock('POST /v1/annotations/:annotationId/note/attachments/presign', {
      status: 200,
      data: okPresign(),
    })
    mockS3Put(403)

    await expect(
      uploadAttachment({
        annotationId: 'ann_1',
        file: fakeFile('agenda.pdf', 'application/pdf'),
      }),
    ).rejects.toThrow(/s3_upload_failed:403/)
  })

  it('propagates complete-step failure', async () => {
    api.mock('POST /v1/annotations/:annotationId/note/attachments/presign', {
      status: 200,
      data: okPresign(),
    })
    api.mock(
      'POST /v1/annotations/:annotationId/note/attachments/:attachmentId/complete',
      { status: 400, data: { message: 'upload_not_received' } },
    )
    mockS3Put(200)

    await expect(
      uploadAttachment({
        annotationId: 'ann_1',
        file: fakeFile('agenda.pdf', 'application/pdf'),
      }),
    ).rejects.toThrow()
  })
})

describe('deleteAttachment', () => {
  it('issues DELETE against the right path', async () => {
    let receivedParams: unknown
    api.mock(
      'DELETE /v1/annotations/:annotationId/note/attachments/:attachmentId',
      ({ params }) => {
        receivedParams = params
        return { status: 200, data: undefined }
      },
    )

    await deleteAttachment({
      annotationId: 'ann_1',
      attachmentId: 'att_1',
    })

    expect(receivedParams).toMatchObject({
      annotationId: 'ann_1',
      attachmentId: 'att_1',
    })
  })

  it('propagates server errors', async () => {
    api.mock(
      'DELETE /v1/annotations/:annotationId/note/attachments/:attachmentId',
      { status: 500, data: { message: 'oops' } },
    )

    await expect(
      deleteAttachment({ annotationId: 'ann_1', attachmentId: 'att_1' }),
    ).rejects.toThrow()
  })
})
