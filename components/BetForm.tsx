'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Bitcoin, Coins } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BetForm() {
  const { currentRound, currentBet, wallet, connected } = useGameStore();
  const { placeBet } = useSocket();
  const [betAmount, setBetAmount] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'ETH'>('BTC');
  const [isPlacing, setIsPlacing] = useState(false);

  const canPlaceBet = () => {
    return (
      connected &&
      currentRound?.status === 'betting' &&
      !currentBet &&
      betAmount &&
      parseFloat(betAmount) > 0 &&
      wallet
    );
  };

  const handlePlaceBet = async () => {
    if (!canPlaceBet()) return;

    const amount = parseFloat(betAmount);
    if (amount < 1) {
      toast.error('Minimum bet is $1');
      return;
    }

    if (amount > 1000) {
      toast.error('Maximum bet is $1000');
      return;
    }

    setIsPlacing(true);
    try {
      placeBet(amount, currency);
      setBetAmount('');
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet');
    } finally {
      setIsPlacing(false);
    }
  };

  const getCurrencyIcon = (curr: string) => {
    return curr === 'BTC' ? <Bitcoin className="w-4 h-4" /> : <Coins className="w-4 h-4" />;
  };

  const getCurrencyColor = (curr: string) => {
    return curr === 'BTC' ? 'text-orange-400' : 'text-blue-400';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span>Place Bet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentBet ? (
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-blue-300 border-blue-600">
                Your Bet
              </Badge>
              <div className="flex items-center space-x-2">
                <div className={getCurrencyColor(currentBet.currency)}>
                  {getCurrencyIcon(currentBet.currency)}
                </div>
                <span className="text-white font-bold">
                  ${currentBet.usdAmount} in {currentBet.currency}
                </span>
              </div>
            </div>
            {currentBet.cashedOut && currentBet.winAmount && (
              <div className="mt-2 pt-2 border-t border-blue-600">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-green-300 border-green-600">
                    Won
                  </Badge>
                  <span className="text-green-400 font-bold">
                    ${currentBet.winAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="betAmount" className="text-sm text-slate-300">
                Amount (USD)
              </Label>
              <Input
                id="betAmount"
                type="number"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="1"
                max="1000"
                step="0.01"
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={!canPlaceBet() || isPlacing}
              />
              <div className="text-xs text-slate-400">
                Min: $1 • Max: $1000
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Currency</Label>
              <Select value={currency} onValueChange={(value: 'BTC' | 'ETH') => setCurrency(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="BTC" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Bitcoin className="w-4 h-4 text-orange-400" />
                      <span>Bitcoin (BTC)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ETH" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-blue-400" />
                      <span>Ethereum (ETH)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handlePlaceBet}
              disabled={!canPlaceBet() || isPlacing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isPlacing ? 'Placing Bet...' : `Place Bet - $${betAmount || '0'}`}
            </Button>

            {!connected && (
              <p className="text-sm text-red-400 text-center">
                Not connected to game server
              </p>
            )}

            {currentRound?.status !== 'betting' && connected && (
              <p className="text-sm text-yellow-400 text-center">
                Betting is closed for this round
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}