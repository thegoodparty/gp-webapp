// Load environment variables
import 'dotenv/config';

// Import Axios for making API requests
import axios from 'axios';

// Check that the environment variables are loaded
console.log("TESTRAIL_URL:", process.env.TESTRAIL_URL);
console.log("TESTRAIL_PROJECT_ID:", process.env.TESTRAIL_PROJECT_ID);
console.log("TESTRAIL_USERNAME:", process.env.TESTRAIL_USERNAME);
console.log("TESTRAIL_API_KEY:", process.env.TESTRAIL_API_KEY);

// Sample function to create a TestRail run
async function createTestRun() {
  try {
    const response = await axios.post(
      `${process.env.TESTRAIL_URL}/index.php?/api/v2/add_run/${process.env.TESTRAIL_PROJECT_ID}`,
      {
        name: 'Playwright Test Run',
        include_all: true,
      },
      {
        auth: {
          username: process.env.TESTRAIL_USERNAME,
          password: process.env.TESTRAIL_API_KEY,
        },
      }
    );

    console.log("Test Run created successfully:", response.data);
  } catch (error) {
    console.error("Error creating TestRail test run:", error.message);
  }
}

// Execute the function
createTestRun();
