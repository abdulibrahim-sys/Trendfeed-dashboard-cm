// Quick test script to diagnose Instantly.ai API connection issues
const API_KEY = 'YzFlNTZhMmEtMjhmYy00NmQ0LTkzYjUtMGUzYzA2MjZjZDczOnF2ZE1XU0NmSUdRZA==';
const API_URL = 'https://api.instantly.ai/api/v2';

async function testEndpoint(endpoint, description) {
  console.log(`\n=== Testing: ${description} ===`);
  console.log(`URL: ${API_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error Response: ${errorText}`);
    } else {
      const data = await response.json();
      console.log(`Success! Response:`, JSON.stringify(data, null, 2).substring(0, 500));
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('Testing Instantly.ai API v2 Connection...\n');

  await testEndpoint('/campaigns', 'List Campaigns');
  await testEndpoint('/campaigns/analytics', 'Campaign Analytics');
  await testEndpoint('/campaigns/analytics/overview', 'Analytics Overview');

  console.log('\n=== Tests Complete ===');
}

runTests();
