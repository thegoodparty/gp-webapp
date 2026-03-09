// DEPRECATED: Password management is now handled by Clerk.
// This function is a no-op stub kept to avoid breaking the admin UI.
// TODO: Remove this file and ResendPasswordEmailAction once confirmed unnecessary.
export const sendSetPasswordEmail = async (
  _userId: string | number,
): Promise<false> => {
  console.warn(
    'sendSetPasswordEmail is deprecated. Password management is now handled by Clerk.',
  )
  return false
}
