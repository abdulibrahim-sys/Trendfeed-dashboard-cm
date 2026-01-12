# Trendfeed Dashboard Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Your `.env` file has already been created with your Instantly.ai API key:

```env
INSTANTLY_API_KEY=YzFlNTZhMmEtMjhmYy00NmQ0LTkzYjUtMGUzYzA2MjZjZDczOnF2ZE1XU0NmSUdRZA==
INSTANTLY_API_URL=https://api.instantly.ai/api/v2
```

⚠️ **Important**: Never commit the `.env` file to git (it's already in `.gitignore`)

### 3. Run the Development Server

```bash
npm run dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

## How the Integration Works

### API Integration Architecture

The dashboard uses a **fallback system** for data:

1. **Primary**: Attempts to fetch real data from Instantly.ai API V2
2. **Fallback**: If the API fails, displays mock data for demonstration

This ensures the dashboard always works, even if there are API issues.

### API Endpoints Used

The dashboard integrates with the following Instantly.ai API V2 endpoints:

| Endpoint | Purpose | Our Implementation |
|----------|---------|-------------------|
| `GET /campaigns/analytics` | Fetch all campaigns with analytics | `getCampaigns()` in `lib/instantly-api.ts` |
| `GET /campaigns/analytics/overview` | Get aggregate metrics across all campaigns | `getMetrics()` in `lib/instantly-api.ts` |
| `GET /campaigns/analytics/daily` | Get daily performance data for charts | `getPerformanceData()` in `lib/instantly-api.ts` |

### Authentication

The dashboard uses **Bearer token authentication** as required by Instantly.ai API V2:

```typescript
headers: {
  'Authorization': `Bearer ${INSTANTLY_API_KEY}`
}
```

## Data Transformation

### Campaign Data Mapping

Instantly.ai API fields are transformed to match our dashboard structure:

| Instantly.ai Field | Dashboard Field | Calculation |
|-------------------|-----------------|-------------|
| `campaign_id` | `id` | Direct mapping |
| `campaign_name` | `name` | Direct mapping |
| `emails_sent` | `emailsSent` | Direct mapping |
| `total_replies` | `replies` | Direct mapping |
| `positive_replies` | `positiveReplies` | Estimated as 60% of total if not provided |
| `meeting_booked` | `meetingsBooked` | Direct mapping from status |
| N/A | `replyRate` | `(replies / emailsSent) × 100` |
| N/A | `positiveReplyRate` | `(positiveReplies / replies) × 100` |
| N/A | `meetingsBookedRate` | `(meetingsBooked / emailsSent) × 100` |

### Metrics Calculations

- **Reply Rate**: Percentage of sent emails that received any reply
- **Positive Reply Rate**: Percentage of replies that are positive (calculated from total replies)
- **Meetings Booked**: Based on "Meeting Booked" status in Instantly.ai

## Testing the Integration

### 1. Check Console Logs

Open your browser's DevTools console to see API responses:

```javascript
// Success
✓ Fetched campaigns from Instantly.ai API

// Fallback
⚠ Falling back to mock data: [error message]
```

### 2. Network Tab

In DevTools Network tab, look for these requests:
- `/api/campaigns`
- `/api/metrics`
- `/api/performance`

### 3. Verify Data

Compare the dashboard data with your Instantly.ai account to verify accuracy.

## Troubleshooting

### Issue: Dashboard shows mock data

**Possible causes:**

1. **API key not configured**
   - Check `.env` file exists and contains `INSTANTLY_API_KEY`
   - Restart the dev server after creating `.env`

2. **Network issues**
   - Verify internet connection
   - Check if `api.instantly.ai` is accessible

3. **API key invalid**
   - Regenerate API key in Instantly.ai dashboard
   - Update `.env` file

4. **API rate limits**
   - Instantly.ai may have rate limits
   - Wait a few minutes and refresh

### Issue: "positive_replies" field missing

The dashboard estimates positive replies as 60% of total replies if this field is not provided by the API. To get accurate data, ensure your Instantly.ai account properly categorizes replies.

### Issue: "meeting_booked" showing zeros

Meetings are tracked via the "Meeting Booked" status in Instantly.ai. Make sure to manually mark leads with this status when they book meetings.

## API Documentation

For complete Instantly.ai API V2 documentation, visit:
- **Main docs**: https://developer.instantly.ai/
- **Analytics endpoints**: https://developer.instantly.ai/api/v2/analytics
- **Campaign endpoints**: https://developer.instantly.ai/api/v2/campaign

## Next Steps

### Customize the Dashboard

1. **Add more metrics**: Edit `types/campaign.ts` and update transformation functions
2. **Change date ranges**: Modify the `getPerformanceData()` function in `lib/instantly-api.ts`
3. **Filter campaigns**: Add query parameters to API calls

### Deploy to Production

When ready to deploy:

1. Set environment variables in your hosting platform
2. Build the project: `npm run build`
3. Deploy: `npm start`

Recommended platforms:
- **Vercel** (recommended for Next.js)
- Netlify
- Railway
- AWS Amplify

## Support

For issues:
- Trendfeed Dashboard: Open an issue in this repository
- Instantly.ai API: Visit https://help.instantly.ai/
