'use client';

import { useGameStore } from '@/store/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function CashoutButton() {
  const { currentRound, currentBet, connected } = useGameStore();
  const { cashOut } = useSocket();
  const [isCashingOut, setIsCashingOut] = useState(false);

  if (!currentBet || currentBet.cashedOut) {
    return null;
  }

  const canCashOut = () => {
    return (
      connected &&
      currentRound?.status === 'active' &&
      currentBet &&
      !currentBet.cashedOut
    );
  };

  const handleCashOut = async () => {
    if (!canCashOut()) return;

    setIsCashingOut(true);
    try {
      cashOut();
    } catch (error) {
      console.error('Error cashing out:', error);
    } finally {
      setIsCashingOut(false);
    }
  };

  const potentialWin = currentBet && currentRound 
    ? currentBet.usdAmount * currentRound.multiplier 
    : 0;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>Cash Out</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentBet.cashedOut ? (
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <Badge variant="outline" className="text-green-400 border-green-600">
                Cashed Out!
              </Badge>
            </div>
            {currentBet.winAmount && (
              <div className="mt-2">
                <span className="text-green-300">
                  Won: ${currentBet.winAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-slate-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Your Bet</span>
                <span className="text-white font-semibold">
                  ${currentBet.usdAmount}
                </span>
              </div>
              <Separator className="bg-slate-600" />
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Current Multiplier</span>
                <Badge variant="outline" className="text-green-400 border-green-600 font-mono">
                  {currentRound?.multiplier.toFixed(2)}x
                </Badge>
              </div>
              <Separator className="bg-slate-600" />
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">Potential Win</span>
                <span className="text-green-400 font-bold">
                  ${potentialWin.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCashOut}
              disabled={!canCashOut() || isCashingOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-3"
            >
              {isCashingOut ? 'Cashing Out...' : `Cash Out - $${potentialWin.toFixed(2)}`}
            </Button>

            {!connected && (
              <p className="text-sm text-red-400 text-center">
                Not connected to game server
              </p>
            )}

            {currentRound?.status !== 'active' && connected && (
              <p className="text-sm text-yellow-400 text-center">
                Can only cash out during active round
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}