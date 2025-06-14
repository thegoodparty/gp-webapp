export const doCreateOutReachEffectHandler = (onCreateOutreach) => () => {
  const doOutreachPersistence = async () => {
    await onCreateOutreach()
  }
  doOutreachPersistence()
}
