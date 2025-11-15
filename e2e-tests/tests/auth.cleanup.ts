import { test as cleanup } from '@playwright/test';
import { OnboardedUserHelper } from '../src/helpers/onboarded-user.helper';

cleanup('cleanup authenticated user', async ({ page }) => {
  const userEmail = process.env.AUTH_SETUP_USER_EMAIL;
  const userPassword = process.env.AUTH_SETUP_USER_PASSWORD;
  
  if (userEmail && userPassword) {
    console.log(`🧹 Cleaning up authenticated user: ${userEmail}`);
    
    try {
      // Login as the auth user
      await OnboardedUserHelper.loginWithOnboardedUser(page, {
        email: userEmail,
        password: userPassword,
        firstName: 'Auth',
        lastName: 'User',
        phone: '5105551234',
        zipCode: '28739'
      });
      
      // Delete the account
      await OnboardedUserHelper.deleteOnboardedUser(page);
      
      console.log('✅ Authentication user cleaned up successfully');
    } catch (error) {
      console.warn('⚠️ Failed to cleanup authentication user:', error.message);
    }
  } else {
    console.log('ℹ️ No authentication user to cleanup');
  }
});
