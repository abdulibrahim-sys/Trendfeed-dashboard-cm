// Test script to verify correct Instantly.ai API endpoints and parameters
const API_KEY = 'YzFlNTZhMmEtMjhmYy00NmQ0LTkzYjUtMGUzYzA2MjZjZDczOnF2ZE1XU0NmSUdRZA==';
const API_URL = 'https://api.instantly.ai/api/v2';

async function testAPI(endpoint, description, options = {}) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${description}`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`${'='.repeat(60)}`);

  try {
    const url = new URL(`${API_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const fetchOptions = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    console.log(`Request URL: ${url}`);
    if (options.body) console.log(`Request Body:`, JSON.stringify(options.body, null, 2));

    const response = await fetch(url, fetchOptions);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error Response:`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Success! Response sample:`, JSON.stringify(data, null, 2).substring(0, 500));
    return data;
  } catch (error) {
    console.log(`❌ Exception:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('\n🚀 Testing Instantly.ai API v2 Endpoints\n');

  // Test 1: List campaigns
  const campaigns = await testAPI('/campaigns', 'List Campaigns', {
    params: { limit: 5 }
  });

  if (campaigns && campaigns.data && campaigns.data.length > 0) {
    const campaignId = campaigns.data[0].id;
    console.log(`\n📌 Using campaign ID for further tests: ${campaignId}`);

    // Test 2: Get emails (replies)
    await testAPI('/emails', 'Get Emails (Replies)', {
      params: {
        email_type: 'received',
        campaign_id: campaignId,
        limit: 5
      }
    });

    // Test 3: List leads - trying different interest_status values
    await testAPI('/leads/list', 'List Leads (No Filter)', {
      method: 'POST',
      body: {
        filters: {
          campaign_id: campaignId
        },
        limit: 5
      }
    });

    // Test 4: Try numeric interest status
    await testAPI('/leads/list', 'List Leads (interest_status: 1)', {
      method: 'POST',
      body: {
        filters: {
          campaign_id: campaignId,
          interest_status: 1
        },
        limit: 5
      }
    });

    // Test 5: Try string interest status
    await testAPI('/leads/list', 'List Leads (interest_status: "positive")', {
      method: 'POST',
      body: {
        filters: {
          campaign_id: campaignId,
          interest_status: 'positive'
        },
        limit: 5
      }
    });

    // Test 6: Get lead labels to see available statuses
    await testAPI('/lead-labels', 'Get Lead Labels', {
      params: { limit: 20 }
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('Tests Complete!');
  console.log('='.repeat(60) + '\n');
}

runTests();
