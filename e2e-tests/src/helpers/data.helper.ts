export class TestDataHelper {
  static generateTestEmail(): string {
    const timestamp = Date.now();
    const env = process.env.NODE_ENV || "local";
    return `test-${timestamp}@${env}.example.com`;
  }

  static generateTestPhone(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `5105${timestamp}`;
  }

  static generateTimestamp(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const hours = `${now.getHours()}`.padStart(2, "0");
    const minutes = `${now.getMinutes()}`.padStart(2, "0");
    const seconds = `${now.getSeconds()}`.padStart(2, "0");
    return `${month}${day}${hours}${minutes}${seconds}`;
  }

  static generateTestUser() {
    return {
      firstName: `Test${this.generateTimestamp()}`,
      lastName: "User",
      email: this.generateTestEmail(),
      phone: this.generateTestPhone(),
      password: "TestPassword123!",
      zipCode: "82901",
    };
  }

  static generateWebsiteUrl(): string {
    const timestamp = this.generateTimestamp();
    return `test-website-${timestamp}`;
  }
}
