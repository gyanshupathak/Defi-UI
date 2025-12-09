# Lucidly New UI

Modern, scalable frontend architecture for Lucidly Finance platform.

## Tech Stack

- **Framework**: Next.js 15.1.4 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.5.4
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── portfolio/
│   │   ├── yields/
│   │   ├── bridge/
│   │   └── leaderboard/
│   ├── earn/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Base UI components
│   ├── navigation/         # Navigation components
│   ├── portfolio/          # Portfolio feature components
│   ├── strategy/            # Strategy feature components
│   └── wallet/             # Wallet feature components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and services
├── stores/                 # State management stores
└── types/                  # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps

1. Import your Figma design tokens and update `tailwind.config.js`
2. Build out components based on your Figma designs
3. Add wallet integration (Wagmi + RainbowKit)
4. Implement data fetching and state management
5. Add charts and visualizations

## Design System

The design system is built on Tailwind CSS with custom design tokens. Update the CSS variables in `src/app/globals.css` to match your Figma design.

