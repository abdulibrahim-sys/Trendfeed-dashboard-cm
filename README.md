# Trendfeed Dashboard

A modern analytics dashboard for monitoring Instantly.ai cold email campaign performance in real-time.

## Features

- **Real-time Metrics**: Track key performance indicators including:
  - Total emails sent
  - Reply rate (percentage and count)
  - Positive reply rate (percentage and count)
  - Meetings booked (percentage and count via Instantly.ai status)
  - Total number of replies

- **Performance Visualization**: Interactive charts showing campaign performance trends over time
  - Daily email volume
  - Reply trends
  - Positive reply trends
  - Meetings booked over time

- **Campaign Management**: Detailed view of all campaigns with comprehensive metrics
  - Per-campaign analytics
  - Individual campaign performance tracking
  - Status monitoring (active, paused, completed)

- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Instantly.ai API key (optional for demo)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abdulibrahim-sys/Trendfeed-dashboard-cm.git
cd Trendfeed-dashboard-cm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Instantly.ai API key:
```
INSTANTLY_API_KEY=your_instantly_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
trendfeed-dashboard/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── campaigns/        # Campaigns endpoint
│   │   ├── metrics/          # Metrics endpoint
│   │   └── performance/      # Performance data endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── DashboardHeader.tsx   # Header component
│   ├── MetricsOverview.tsx   # Metrics cards
│   ├── PerformanceChart.tsx  # Performance chart
│   └── CampaignList.tsx      # Campaign table
├── lib/                      # Utilities and helpers
│   ├── instantly-api.ts      # Instantly.ai API client
│   └── mockData.ts           # Mock data for demo
├── types/                    # TypeScript type definitions
│   └── campaign.ts           # Campaign-related types
└── public/                   # Static assets
```

## Instantly.ai API Integration

The dashboard is designed to integrate with Instantly.ai's API. Currently, it uses mock data for demonstration purposes.

### Setting up Live Data

1. Obtain your API key from [Instantly.ai](https://instantly.ai)
2. Add the API key to your `.env` file
3. Update the API integration in `lib/instantly-api.ts`
4. Uncomment the actual API calls in the route handlers under `app/api/`

### API Endpoints

The dashboard exposes the following API endpoints:

- `GET /api/campaigns` - Fetch all campaigns
- `GET /api/metrics` - Fetch overall metrics
- `GET /api/performance?days=7` - Fetch performance data for specified days

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

## Customization

### Adding New Metrics

1. Update the types in `types/campaign.ts`
2. Add the metric to `lib/mockData.ts` for testing
3. Update the corresponding components in `components/`
4. Modify API integration in `lib/instantly-api.ts`

### Styling

The project uses Tailwind CSS for styling. You can customize the design by:

- Modifying `tailwind.config.ts` for theme customization
- Updating component styles in the respective component files
- Editing global styles in `app/globals.css`

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The dashboard can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Roadmap

- [ ] Real-time data updates with WebSocket support
- [ ] Advanced filtering and search capabilities
- [ ] Campaign comparison tools
- [ ] Export data to CSV/Excel
- [ ] Email template performance analysis
- [ ] A/B testing insights
- [ ] Custom date range selection
- [ ] Dark mode support
- [ ] Multi-account support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue in this repository
- Contact: [your-email@example.com]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
- Designed for [Instantly.ai](https://instantly.ai/)
