import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Socket } from 'socket.io-client';

export interface Player {
  id: string;
  name: string;
}

export interface Wallet {
  btc: number;
  eth: number;
  usdEquivalent: number;
  lastUpdated: string;
}

export interface Bet {
  id: string;
  playerId: string;
  usdAmount: number;
  currency: 'BTC' | 'ETH';
  multiplier?: number;
  cashedOut: boolean;
  winAmount?: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  status: 'waiting' | 'betting' | 'active' | 'crashed';
  multiplier: number;
  crashPoint?: number;
  startTime: string;
  endTime?: string;
  bets: Bet[];
}

export interface GameFeedItem {
  id: string;
  type: 'bet_placed' | 'cashout' | 'crash' | 'round_start';
  message: string;
  timestamp: string;
  playerId?: string;
  playerName?: string;
}

interface GameState {
  player: Player | null;
  wallet: Wallet | null;

  currentRound: Round | null;
  currentBet: Bet | null;
  roundHistory: Round[];
  gameFeed: GameFeedItem[];

  socket: Socket | null;
  connected: boolean;

  isLoading: boolean;
  error: string | null;

  timeLeft: number;

  setPlayer: (player: Player) => void;
  setWallet: (wallet: Wallet) => void;
  setSocket: (socket: Socket | null) => void; // 🔥 Fix is here
  setConnected: (connected: boolean) => void;
  setCurrentRound: (round: Round) => void;
  setCurrentBet: (bet: Bet | null) => void;
  updateMultiplier: (multiplier: number) => void;
  addToHistory: (round: Round) => void;
  addToFeed: (item: GameFeedItem) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimeLeft: (time: number) => void;
  clearGameData: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      wallet: null,
      currentRound: null,
      currentBet: null,
      roundHistory: [],
      gameFeed: [],
      socket: null,
      connected: false,
      isLoading: false,
      error: null,
      timeLeft: 0,

      setPlayer: (player) => set({ player }),
      setWallet: (wallet) => set({ wallet }),
      setSocket: (socket) => set({ socket }), // 🔥 Fix here too
      setConnected: (connected) => set({ connected }),
      setCurrentRound: (round) => set({ currentRound: round }),
      setCurrentBet: (bet) => set({ currentBet: bet }),

      updateMultiplier: (multiplier) => {
        const currentRound = get().currentRound;
        if (currentRound) {
          set({
            currentRound: { ...currentRound, multiplier },
          });
        }
      },

      addToHistory: (round) => {
        set((state) => ({
          roundHistory: [round, ...state.roundHistory.slice(0, 19)],
        }));
      },

      addToFeed: (item) => {
        set((state) => ({
          gameFeed: [item, ...state.gameFeed.slice(0, 49)],
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setTimeLeft: (time) => set({ timeLeft: time }),

      clearGameData: () =>
        set({
          currentRound: null,
          currentBet: null,
          roundHistory: [],
          gameFeed: [],
          socket: null,
          connected: false,
          timeLeft: 0,
        }),
    }),
    {
      name: 'crypto-crash-game',
      partialize: (state) => ({
        player: state.player,
        wallet: state.wallet,
      }),
    }
  )
);