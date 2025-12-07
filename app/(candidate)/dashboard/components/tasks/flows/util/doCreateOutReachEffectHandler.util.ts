export const doCreateOutReachEffectHandler = (onCreateOutreach: () => Promise<void>) => () => {
  const doOutreachPersistence = async () => {
    await onCreateOutreach()
  }
  doOutreachPersistence()
}


