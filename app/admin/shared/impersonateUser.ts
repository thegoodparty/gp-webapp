/**
 * @deprecated Impersonation is being migrated to Clerk Actor Tokens.
 * Use the `useImpersonateUser` hook from `@shared/hooks/useImpersonateUser` instead.
 * This standalone helper previously set impersonation cookies directly.
 */
export const handleImpersonateUser = async (
  _email: string,
): Promise<boolean> => {
  console.warn(
    'Impersonation is not yet available with Clerk. Requires Actor Token setup.',
  )
  return false
}
