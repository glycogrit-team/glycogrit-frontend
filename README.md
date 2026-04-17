# GlycoGrit Frontend

React frontend for the GlycoGrit application - a platform for fitness and wellness.

## About

GlycoGrit is a comprehensive fitness and wellness platform designed to help users track their health goals, monitor progress, and achieve their fitness objectives.

## Tech Stack

- **React 18.2.0** - UI library
- **Vite 5.2.0** - Build tool and dev server
- **ESLint** - Code linting and quality

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 11.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/glycogrit/glycogrit-frontend.git
cd glycogrit-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (Doppler):
```bash
# The project uses Doppler for secrets management
# For local development, use the dev_personal config:
doppler run --project glycogrit --config dev_personal -- npm run dev
```

4. Start the development server:
```bash
npm run dev
```

The application will open at [http://localhost:5173](http://localhost:5173)

### Environment Configuration

This project uses [Doppler](https://doppler.com) for environment variable management across all environments.

**Configuration:**
- **Project:** `glycogrit` (shared with backend)
- **Local Dev:** `dev_personal` config
- **Production:** `prd_backend` config (contains VITE_API_URL and other production secrets)

**Why Doppler?**
- Single source of truth for secrets
- No `.env` files in production
- Automatic secret injection in CI/CD
- Shared configuration between frontend and backend

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Instagram Integration

The Gallery page displays Instagram photos from the @glycogrit account using Instagram Graph API.

### Token Maintenance

The Instagram access token is a long-lived token that **expires every 60 days**.

**⚠️ IMPORTANT**: Set a calendar reminder to refresh the token before expiry!

See [INSTAGRAM_TOKEN_MAINTENANCE.md](./INSTAGRAM_TOKEN_MAINTENANCE.md) for:
- Current token expiry date
- How to refresh the token
- Token refresh history
- Troubleshooting guide

For initial setup, see [INSTAGRAM_TOKEN_GUIDE.md](./INSTAGRAM_TOKEN_GUIDE.md).

## Project Structure

```
glycogrit-frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── App.jsx      # Main App component
│   ├── App.css      # App styles
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
└── package.json     # Dependencies and scripts
```

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Submit a pull request to `master`

## License

See [LICENSE](LICENSE) file for details.
