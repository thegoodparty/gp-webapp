export class TestDataHelper {
  /**
   * Generate test user data (does NOT create actual user)
   * Use this for form validation tests that don't submit
   */
  static generateTestUser() {
    const timestamp = Date.now()
    return {
      firstName: `Test${timestamp}`,
      lastName: 'User',
      email: `test-${timestamp}@test.goodparty.org`,
      phone: `5105${timestamp.toString().slice(-6)}`,
      password: process.env.TEST_DEFAULT_PASSWORD || 'TestPassword123!',
      zipCode: '28739',
    }
  }

  /**
   * Generate timestamp string
   */
  static generateTimestamp(): string {
    const now = new Date()
    const month = `${now.getMonth() + 1}`.padStart(2, '0')
    const day = `${now.getDate()}`.padStart(2, '0')
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    const seconds = `${now.getSeconds()}`.padStart(2, '0')
    return `${month}${day}${hours}${minutes}${seconds}`
  }
}
