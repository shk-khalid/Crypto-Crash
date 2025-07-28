'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useSocket } from '@/hooks/useSocket';
import GameHeader from '@/components/GameHeader';
import BetForm from '@/components/BetForm';
import CashoutButton from '@/components/CashoutButton';
import WalletCard from '@/components/WalletCard';
import RoundHistory from '@/components/RoundHistory';
import GameFeed from '@/components/GameFeed';
import { Button } from '@/components/ui/button';
import { LogOut, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GamePage() {
  const { player, clearGameData } = useGameStore();
  const { connected } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!player) {
      router.push('/');
      return;
    }
  }, [player, router]);

  const handleLeaveGame = () => {
    clearGameData();
    toast.success('Left the game');
    router.push('/');
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Crypto Crash</h1>
              <p className="text-slate-400">Welcome, {player.name}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLeaveGame}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Game
          </Button>
        </div>

        {/* Connection Status */}
        {!connected && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-300">
                Disconnected from game server. Attempting to reconnect...
              </span>
            </div>
          </div>
        )}

        {/* Game Header */}
        <GameHeader />

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Betting & Cashout */}
          <div className="lg:col-span-4 space-y-6">
            <BetForm />
            <CashoutButton />
            <WalletCard />
          </div>

          {/* Right Column - History & Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RoundHistory />
              <GameFeed />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Crypto Crash - Real-time Multiplayer Betting Game</p>
          <p className="mt-1">Bet responsibly. This is for demonstration purposes only.</p>
        </div>
      </div>
    </div>
  );
}