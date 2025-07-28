# Crypto Crash - Real-time Multiplayer Game Frontend

A modern, responsive frontend for a multiplayer "Crypto Crash" game built with Next.js, featuring real-time WebSocket communication, crypto betting, and sleek UI design.

![Crypto Crash Game](https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## 🎮 Game Overview

Crypto Crash is an exciting real-time multiplayer betting game where:
- Players bet USD amounts converted to cryptocurrency (BTC/ETH)
- A multiplier starts at 1x and increases until it randomly "crashes"
- Players must cash out before the crash to win
- New rounds start every 10 seconds
- Real-time updates keep all players synchronized

## ✨ Features

### 🎯 Core Functionality
- **Real-time Multiplayer**: Live WebSocket connection for instant updates
- **Crypto Betting**: Bet USD amounts converted to BTC or ETH
- **Live Multiplier**: Watch the multiplier increase in real-time
- **Instant Cashout**: Cash out anytime before the crash
- **Wallet Management**: Track BTC/ETH balances with USD equivalent
- **Round History**: View past rounds and crash points
- **Live Feed**: See other players' bets and cashouts in real-time

### 🎨 Design Features
- **Modern Dark Theme**: Sleek dark UI with neon accents
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Real-time Visual Feedback**: Toast notifications for all actions
- **Professional Layout**: Card-based design with glassmorphism effects

### 🔧 Technical Features
- **Next.js 13+**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Socket.IO**: Real-time WebSocket communication
- **Zustand**: Lightweight state management with persistence
- **TailwindCSS**: Utility-first styling with custom design system
- **ShadCN/UI**: High-quality component library
- **React Hot Toast**: Beautiful toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A running Crypto Crash backend server (Node.js + Socket.IO)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd crypto-crash-frontend
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (player join)
│   └── game/
│       └── page.tsx       # Main game interface
├── components/            # React components
│   ├── ui/               # ShadCN/UI components
│   ├── BetForm.tsx       # Betting interface
│   ├── CashoutButton.tsx # Cashout functionality
│   ├── WalletCard.tsx    # Wallet display
│   ├── GameHeader.tsx    # Game status header
│   ├── RoundHistory.tsx  # Past rounds display
│   └── GameFeed.tsx      # Live activity feed
├── hooks/                # Custom React hooks
│   └── useSocket.ts      # Socket.IO connection hook
├── store/                # State management
│   └── gameStore.ts      # Zustand store
├── lib/                  # Utilities
│   ├── api.ts           # Axios API configuration
│   └── socket.ts        # Socket.IO client setup
└── styles/              # Global styles
    └── globals.css      # Tailwind CSS imports
```

## 🎯 Game Flow

### 1. Player Registration
- Enter player name on home page
- Creates temporary wallet with starting balance
- Redirects to game interface

### 2. Game Rounds
- **Waiting Phase**: New round preparation
- **Betting Phase**: 10-second window to place bets
- **Active Phase**: Multiplier increases until crash
- **Crashed Phase**: Round ends, payouts processed

### 3. Betting System
- Input USD amount ($1 - $1000)
- Choose cryptocurrency (BTC or ETH)
- Bet placed when round is in betting phase
- Cannot bet twice in same round

### 4. Cashout System
- Available during active phase only
- Click "Cash Out" to secure winnings
- Winnings = Bet Amount × Current Multiplier
- Cannot cashout after crash

## 🔌 Backend Integration

### Socket.IO Events

**Client → Server:**
```typescript
// Place a bet
socket.emit('place_bet', { 
  usdAmount: 100, 
  currency: 'BTC' 
});

// Request cashout
socket.emit('cashout_request', {});
```

**Server → Client:**
```typescript
// Round started
socket.on('round_start', (round) => {});

// Multiplier update
socket.on('multiplier_update', ({ multiplier }) => {});

// Round ended
socket.on('round_end', (round) => {});

// Bet placed by any player
socket.on('bet_placed', ({ bet, playerName }) => {});

// Player cashed out
socket.on('player_cashout', ({ bet, playerName }) => {});

// Wallet updated
socket.on('wallet_data', (wallet) => {});

// Success confirmations
socket.on('bet_placed_success', ({ bet }) => {});
socket.on('cashout_success', ({ bet }) => {});

// Error handling
socket.on('error', ({ message }) => {});
```

### REST API Endpoints

```typescript
// Create new player
POST /api/user
Body: { playerName: string }
Response: { playerId: string, playerName: string }

// Get wallet data
GET /api/user/:id/wallet
Response: { btc: number, eth: number, usdEquivalent: number }

// Get round history
GET /api/game/rounds?limit=10
Response: Round[]
```

## 🎨 Design System

### Colors
- **Primary**: Orange to Red gradient (`from-orange-500 to-red-500`)
- **Secondary**: Blue accents (`text-blue-400`)
- **Success**: Green (`text-green-400`)
- **Warning**: Yellow (`text-yellow-400`)
- **Error**: Red (`text-red-400`)
- **Background**: Dark slate gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale from text-sm to text-4xl
- **Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Components
- **Cards**: Slate background with subtle borders
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Dark theme with proper focus states
- **Toasts**: Custom styled notifications

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 375px - 767px (single column layout)
- **Tablet**: 768px - 1023px (adapted two-column)
- **Desktop**: 1024px+ (full multi-column layout)

### Mobile Optimizations
- Touch-friendly button sizes (min 44px)
- Simplified navigation
- Stacked card layouts
- Optimized typography scaling

## 🔧 State Management

### Zustand Store Structure
```typescript
interface GameState {
  // Player data
  player: Player | null;
  wallet: Wallet | null;
  
  // Game state
  currentRound: Round | null;
  currentBet: Bet | null;
  roundHistory: Round[];
  gameFeed: GameFeedItem[];
  
  // Connection
  socket: Socket | null;
  connected: boolean;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  timeLeft: number;
}
```

### Persistence
- Player data persisted in localStorage
- Wallet information cached locally
- Game state resets on page refresh (intentional)

## 🚨 Error Handling

### Connection Issues
- Automatic reconnection attempts
- Visual connection status indicator
- Graceful degradation when offline
- Clear error messages to users

### API Errors
- Axios interceptors for global error handling
- Toast notifications for user feedback
- Fallback UI states for failed requests
- Retry mechanisms for critical operations

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Player registration flow
- [ ] Socket connection establishment
- [ ] Bet placement validation
- [ ] Real-time multiplier updates
- [ ] Cashout functionality
- [ ] Wallet balance updates
- [ ] Round history display
- [ ] Live feed updates
- [ ] Responsive design on all devices
- [ ] Error handling scenarios

### Automated Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests
npm run test
```

## 🔒 Security Considerations

### Client-Side Security
- Input validation on all forms
- XSS prevention through proper escaping
- No sensitive data in localStorage
- Secure WebSocket connections (WSS in production)

### Backend Communication
- API rate limiting considerations
- Proper error message sanitization
- No authentication tokens in client storage
- CORS configuration for production

## 📈 Performance Optimizations

### Bundle Optimization
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Image optimization with Next.js Image component
- Tree shaking for unused dependencies

### Runtime Performance
- React.memo for expensive components
- useCallback for event handlers
- Efficient re-renders with proper dependencies
- Virtual scrolling for large lists (if needed)

### WebSocket Optimization
- Connection pooling
- Event throttling for high-frequency updates
- Graceful connection recovery
- Minimal payload sizes

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
NODE_ENV=production
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site generation support
- **AWS/DigitalOcean**: Custom server deployments
- **Docker**: Containerized deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Cannot connect to backend:**
- Verify backend server is running
- Check environment variables
- Confirm CORS settings

**WebSocket connection fails:**
- Check firewall settings
- Verify WebSocket URL format
- Test with different network

**Styles not loading:**
- Run `npm install` to ensure dependencies
- Check Tailwind CSS configuration
- Verify CSS import statements

**Build errors:**
- Clear `.next` folder and rebuild
- Check TypeScript compilation
- Verify all imports are correct

### Support
For issues and questions:
1. Check existing GitHub issues
2. Create detailed bug reports
3. Include browser console logs
4. Provide reproduction steps

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.