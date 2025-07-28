'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { gameAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Zap, User, Wallet, TrendingUp, Shield, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setPlayer, setWallet } = useGameStore();
  const router = useRouter();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (playerName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (playerName.length > 20) {
      toast.error('Name must be less than 20 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await gameAPI.createUser(playerName.trim());
      const { playerId, playerName: name } = response.data;
      
      // Set player in store
      setPlayer({ id: playerId, name });
      
      // Fetch initial wallet data
      try {
        const walletResponse = await gameAPI.getWallet(playerId);
        setWallet(walletResponse.data);
      } catch (walletError) {
        console.warn('Could not fetch wallet data:', walletError);
      }
      
      toast.success(`Welcome, ${name}!`);
      router.push('/game');
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to join game';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Crypto Crash
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              Real-time Multiplayer Betting Game
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Bet on the multiplier before it crashes. Cash out at the right time to maximize your winnings!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Join Game Form */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-2xl">
                  <User className="w-6 h-6 text-blue-400" />
                  <span>Join the Game</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinGame} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="playerName" className="text-slate-300 text-base">
                      Player Name
                    </Label>
                    <Input
                      id="playerName"
                      type="text"
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-lg h-12"
                      disabled={isLoading}
                      maxLength={20}
                    />
                    <p className="text-sm text-slate-400">
                      2-20 characters, visible to other players
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !playerName.trim()}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold text-lg h-12 transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Join Game</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Game Features */}
            <div className="space-y-6">
              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl">How to Play</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">1. Place Your Bet</h3>
                      <p className="text-slate-400 text-sm">
                        Bet USD amounts converted to BTC or ETH during the 10-second betting window
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-600 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">2. Watch the Multiplier</h3>
                      <p className="text-slate-400 text-sm">
                        The multiplier starts at 1x and increases until it randomly crashes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-600 rounded-lg flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">3. Cash Out in Time</h3>
                      <p className="text-slate-400 text-sm">
                        Cash out before the crash to win your bet × current multiplier
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white text-xl">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>Game Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-green-400 font-bold text-lg">Real-time</div>
                      <div className="text-slate-400">Live multiplayer</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-blue-400 font-bold text-lg">Crypto</div>
                      <div className="text-slate-400">BTC & ETH betting</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-purple-400 font-bold text-lg">Fast</div>
                      <div className="text-slate-400">10s rounds</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-orange-400 font-bold text-lg">Fair</div>
                      <div className="text-slate-400">Transparent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-slate-500 text-sm">
            <p>Crypto Crash - Real-time Multiplayer Betting Game</p>
            <p className="mt-1">Bet responsibly. This is for demonstration purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}