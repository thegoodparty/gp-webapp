export const isTestUser = (params: { email: string }) =>
  params.email.endsWith('@test.goodparty.org')
